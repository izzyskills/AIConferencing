from datetime import datetime
import os
import aiofiles
from typing import List
import uuid
from fastapi import APIRouter, Depends, File, UploadFile, WebSocket, WebSocketDisconnect
from fastapi.exceptions import HTTPException
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from src.auth.dependencies import AccessTokenBearer
from src.celery_tasks import send_email
from src.config import Config
from src.db.main import get_session
from src.db.models import Room, RoomMember
from .schemas import RoomMemberModel, CreateRoomModel, RoomResponseModel
from .services import RoomService
from src.errors import InvalidCredentials

room_router = APIRouter()
room_service = RoomService()


@room_router.post("/create")
async def create_room(
    room_data: CreateRoomModel,
    token: dict = Depends(AccessTokenBearer()),
    session: AsyncSession = Depends(get_session),
):
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
    send_email.delay(members_email, "Room Created", html_message)

    return new_room


@room_router.post("/join/{rid}")
async def join_room(
    rid: uuid.UUID,
    room_member_data: RoomMemberModel,
    token: dict = Depends(AccessTokenBearer()),
    session: AsyncSession = Depends(get_session),
):
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
    # Generate unique filename
    date_str = datetime.now().strftime("%Y%m%d%H%M%S")
    unique_filename = f"{rid}_{date_str}_{file.filename}"
    file_path = os.path.join(AUDIO_SAVE_PATH, unique_filename)

    async with aiofiles.open(file_path, "wb") as buffer:
        content = await file.read()
        await buffer.write(content)

    # Add entry to MeetingExtracts table using RoomService
    new_extract = await room_service.add_meeting_extract(rid, file_path, session)

    return {
        "message": "Audio uploaded successfully",
        "file_path": new_extract.file_path,
    }


@room_router.get("/all", response_model=List[RoomResponseModel])
async def get_rooms(
    token: dict = Depends(AccessTokenBearer()),
    session: AsyncSession = Depends(get_session),
):
    user_id = token["user"]["user_uid"]
    rooms = await room_service.get_all_user_rooms(user_id, session)
    return rooms


@room_router.get("/future", response_model=List[RoomResponseModel])
async def get_future_rooms(
    token: dict = Depends(AccessTokenBearer()),
    session: AsyncSession = Depends(get_session),
):
    user_id = token["user"]["user_uid"]
    rooms = await room_service.get_all_active_user_rooms(user_id, session)
    return rooms


# @room_router.post("/call/start")
# async def start_call(
#     room_id: uuid.UUID,
#     token: dict = Depends(AccessTokenBearer()),
#     session: AsyncSession = Depends(get_session),
# ):
#     # 1. Fetch the room
#     room = await session.get(Room, room_id)
#     if not room:
#         raise HTTPException(status_code=404, detail="Room not found")
#
#     now = datetime.now()
#     # 2. Check timing
#     if now < room.opens_at:
#         raise HTTPException(status_code=400, detail="Call cannot be started yet")
#     if now > room.closes_at:
#         raise HTTPException(status_code=400, detail="Call has already ended")
#
#     # 3. If the room is private, verify the requester is allowed to join.
#     if not room.public:
#         result = await session.execute(
#             select(RoomMember).where(
#                 RoomMember.room_id == room_id,
#                 RoomMember.user_id == token["user"]["user_uid"],
#             )
#         )
#         member = result.scalar_one_or_none()
#         if not member:
#             raise HTTPException(
#                 status_code=403, detail="You are not allowed to join this call"
#             )
#
#     # 4. Create call token using Stream's server SDK.
#     try:
#         stream_client = stream_chat.StreamChat(
#             api_key=Config.STREAM_API_KEY, api_secret=Config.STREAM_SECRET
#         )
#         # Here you create a token for the user (for actual call creation,
#         # you may need to call additional APIs provided by Stream Video)
#         call_token = stream_client.create_token(str(token["user"]["user_uid"]))
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Stream API error: {str(e)}")
#
#     # 5. Mark the room as in session
#     room.in_session = True
#     session.add(room)
#     await session.commit()
#
#     # 6. Gather allowed participants’ emails for notifications.
#     result = await session.exec(select(RoomMember).where(RoomMember.room_id == room_id))
#     allowed_members = result.all()
#     # This assumes that the RoomMember has a "user" relationship that loads the user’s email.
#     emails = [
#         member.user.email
#         for member in allowed_members
#         if hasattr(member, "user") and member.user.email
#     ]
#
#     # 7. Trigger a Celery task to send notifications.
#     send_email.delay(
#         emails,
#         "Call Started",
#         f"The call for room '{room.name}' has started. Join now using the app.",
#     )
#
#     return {"status": "success", "call_token": call_token, "room_id": str(room_id)}
