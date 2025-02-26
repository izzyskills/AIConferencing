from collections import defaultdict
from datetime import datetime, timedelta
import os
import shutil
import uuid
from fastapi import APIRouter, Depends, File, UploadFile, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import selectinload
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from src.auth.dependencies import AccessTokenBearer
from src.auth.schemas import EmailModel
from src.celery_tasks import send_email
from src.config import Config
from src.db.main import get_session
from src.db.models import Room
from .schemas import RoomMemberModel, CreateRoomModel
from .services import RoomService
from src.errors import InvalidToken, UserNotFound, InvalidCredentials

room_router = APIRouter()
room_service = RoomService()


@room_router.post("/create")
async def create_room(
    room_data: CreateRoomModel,
    token: dict = Depends(AccessTokenBearer()),
    session: AsyncSession = Depends(get_session),
):
    print(token["user"]["user_uid"], room_data.created_by)
    if str(token["user"]["user_uid"]) != str(room_data.created_by):
        raise InvalidCredentials
    new_room = await room_service.create_room(room_data, session)
    members_email = await room_service.get_all_room_members_emails(
        new_room.rid, session
    )
    link = f"http:/{Config.DOMAIN}/room/{new_room.rid}"
    html_message = f"""
    <html>
        <body>
            <h1>Room Created</h1>
            <p> You are invited to join the meeting.<br/>
            it opens at {new_room.opens_at} </p>
            </p>
            <p>Click <a href="{link}">here</a> to join the room</p>
        </body>"""
    # send_email.delay(members_email, "Room Created", html_message)

    return new_room


@room_router.post("/join/{rid}")
async def join_room(
    rid: uuid.UUID,
    room_member_data: RoomMemberModel,
    token: dict = Depends(AccessTokenBearer()),
    session: AsyncSession = Depends(get_session),
):
    print(room_member_data)
    if str(room_member_data.user_id) != str(token["user"]["user_uid"]):
        raise InvalidCredentials
    if str(room_member_data.room_id) != str(rid):
        raise InvalidCredentials
    room = await room_service.join_room(room_member_data, session)
    return room


AUDIO_SAVE_PATH = "recordings"
os.makedirs(AUDIO_SAVE_PATH, exist_ok=True)


@room_router.post("/upload/{rid}")
async def upload_file(
    rid: uuid.UUID,
    file: UploadFile = File(...),
    token: dict = Depends(AccessTokenBearer()),
    session: AsyncSession = Depends(get_session),
):
    file_path = os.path.join(AUDIO_SAVE_PATH, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"message": "Audio uploaded successfully", "file_path": file_path}


@room_router.get("/all")
async def get_rooms(
    token: dict = Depends(AccessTokenBearer()),
    session: AsyncSession = Depends(get_session),
):
    user_id = token["user"]["user_uid"]
    rooms = await room_service.get_all_user_rooms(user_id, session)
    return rooms


@room_router.get("/future")
async def get_future_rooms(
    token: dict = Depends(AccessTokenBearer()),
    session: AsyncSession = Depends(get_session),
):
    user_id = token["user"]["user_uid"]
    rooms = await room_service.get_all_active_user_rooms(user_id, session)
    return rooms


# Add to your FastAPI routes


class ConnectionManager:
    def __init__(self):
        self.active_connections = {}
        self.room_connections = defaultdict(dict)
        self.usernames = {}

    async def connect(
        self, websocket: WebSocket, room_id: str, user_id: str, user_name: str
    ):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        self.room_connections[room_id][user_id] = websocket
        self.usernames[user_id] = user_name

    def disconnect(self, room_id: str, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]
        if (
            room_id in self.room_connections
            and user_id in self.room_connections[room_id]
        ):
            del self.room_connections[room_id][user_id]
        if user_id in self.usernames:
            del self.usernames[user_id]

    async def send_personal_message(self, message: dict, user_id: str):
        if websocket := self.active_connections.get(user_id):
            await websocket.send_json(message)

    async def broadcast(self, message: dict, room_id: str, exclude_user: str = None):
        for uid, websocket in self.room_connections[room_id].items():
            if uid != exclude_user:
                await websocket.send_json(message)


manager = ConnectionManager()


@room_router.websocket("/ws/{room_id}/{user_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    room_id: str,
    user_id: str,
    username: str,
    session: AsyncSession = Depends(get_session),
):
    await manager.connect(websocket, room_id, user_id, username)
    # Validate room access
    result = await session.exec(
        select(Room).options(selectinload(Room.members)).where(Room.rid == room_id)
    )
    room = result.first()
    if not room:
        await websocket.close(code=4404)
        return

    # Check room schedule

    now = datetime.now().astimezone(room.opens_at.tzinfo)
    if now < room.opens_at:
        await websocket.send_json(
            {"type": "error", "message": f"Room opens at {room.opens_at.isoformat()}"}
        )
        await websocket.close(code=4423)
        return

    if now > room.closes_at:
        await websocket.send_json(
            {"type": "error", "message": f"Room closed at {room.closes_at.isoformat()}"}
        )
        await websocket.close(code=4410)
        return
    print(manager.active_connections.keys())
    admin_present = any(
        member.is_admin
        for member in room.members
        if str(member.user_id) in list(manager.active_connections.keys())
    )
    if not admin_present and user_id != str(room.created_by):
        await websocket.send_json(
            {"type": "error", "message": "Admin is not present in the room"}
        )
        await websocket.close(code=4411)
        return

    is_admin = user_id == str(room.created_by)
    await websocket.send_json({"type": "admin-info", "isAdmin": is_admin})

    current_users = [
        {"userId": uid, "username": manager.usernames[uid]}
        for uid in manager.room_connections[room_id].keys()
    ]
    await websocket.send_json({"type": "current-users", "users": current_users})

    try:
        await manager.broadcast(
            {"type": "user-joined", "userId": user_id, "username": username},
            room_id,
            exclude_user=user_id,
        )

        while True:
            data = await websocket.receive_json()
            if data["type"] == "offer":
                await manager.send_personal_message(
                    {"type": "offer", "sender": user_id, "offer": data["offer"]},
                    data["target"],
                )

            elif data["type"] == "answer":
                await manager.send_personal_message(
                    {"type": "answer", "sender": user_id, "answer": data["answer"]},
                    data["target"],
                )

            elif data["type"] == "ice-candidate":
                await manager.send_personal_message(
                    {
                        "type": "ice-candidate",
                        "sender": user_id,
                        "candidate": data["candidate"],
                    },
                    data["target"],
                )

    except WebSocketDisconnect:
        manager.disconnect(room_id, user_id)
        await manager.broadcast({"type": "user-left", "userId": user_id}, room_id)

        if user_id == str(room.created_by):
            await manager.broadcast(
                {type: "admin-left", "message": "Admin left the room. Closing room."},
                room_id,
            )
            for uid in list(manager.room_connections[room_id].keys()):
                await manager.active_connections[uid].close(code=4412)
            del manager.active_connections[room_id]
