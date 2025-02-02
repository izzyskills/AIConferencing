from datetime import timedelta
import uuid
from fastapi import APIRouter, Depends
from sqlmodel.ext.asyncio.session import AsyncSession
from src.auth.dependencies import AccessTokenBearer
from src.auth.schemas import EmailModel
from src.celery_tasks import send_email
from src.config import Config
from src.db.main import get_session
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
    link = f"http:/{Config.DOMAIN}/room/join/{new_room.rid}"
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
    if room_member_data.user_id != token["user"]["user_uid"]:
        raise InvalidCredentials
    if room_member_data.room_id != rid:
        raise InvalidCredentials
    room = await room_service.join_room(room_member_data, session)
    return room


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
