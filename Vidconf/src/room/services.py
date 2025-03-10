from datetime import datetime, timedelta
import uuid
from sqlalchemy.orm import joinedload, selectinload
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from src.db.models import Room, RoomMember, User
from src.errors import (
    PrivateRoomAccessDeniedException,
    RoomCloasedException,
    RoomFullException,
    RoomNotFoundException,
    RoomNotSartedException,
    UserAlreadyInRoomException,
    UserNotFoundException,
)
from src.room.utils import convert_email_to_RoomMemberModel
from .schemas import CreateRoomModel, RoomMemberModel, RoomResponseModel


class RoomService:
    async def create_room(self, room_data: CreateRoomModel, session: AsyncSession):
        room_data_dict = room_data.model_dump(exclude={"members"})

        member_emails = room_data.members or []
        # Get the user by UUID
        created_by_uuid = room_data_dict["created_by"]
        user = await session.exec(select(User).where(User.uid == created_by_uuid))
        user = user.first()
        if user is None:
            raise ValueError(f"User with UUID {created_by_uuid} not found")

        creator_email = user.email
        print("creator email", creator_email)
        new_room = Room(**room_data_dict)

        session.add(new_room)

        # Convert member emails to RoomMemberModel objects
        new_room.members = []
        print("new_room", new_room)

        for email in member_emails:
            is_admin = email == creator_email
            member_data = await convert_email_to_RoomMemberModel(
                session, email, None, is_admin=is_admin, joint=is_admin
            )
            if member_data:
                # Don't include room_id, SQLAlchemy will handle it
                member_data_dict = member_data.model_dump(exclude={"room_id"})
                new_room.members.append(RoomMember(**member_data_dict))

        # Add creator if not already included
        if not any(member.user_id == user.uid for member in new_room.members):
            new_room.members.append(
                RoomMember(user_id=user.uid, is_admin=True, joint=True)
            )

        await session.commit()
        await session.refresh(new_room)
        return new_room

    async def get_room_by_id(self, rid: uuid.UUID, session: AsyncSession):
        statement = select(Room).where(Room.rid == rid)

        result = await session.exec(statement)

        room = result.first()

        return room

    async def get_all_user_rooms(self, uid: uuid.UUID, session: AsyncSession):
        statement = (
            select(Room)
            .options(joinedload(Room.members))
            .where(
                (Room.created_by == uid)
                | (
                    Room.rid.in_(
                        select(RoomMember.room_id).where(RoomMember.user_id == uid)
                    )
                )
            )
        )
        result = await session.exec(statement)
        rooms = result.unique().all()
        return rooms

    async def get_all_active_user_rooms(self, uid: uuid.UUID, session: AsyncSession):
        now = datetime.utcnow()
        past_time = now - timedelta(minutes=59)

        statement = (
            select(Room)
            .options(joinedload(Room.members))
            .where(
                (Room.created_by == uid)
                | (
                    Room.rid.in_(
                        select(RoomMember.room_id).where(RoomMember.user_id == uid)
                    )
                ),
                Room.opens_at >= past_time,
            )
        )
        result = await session.exec(statement)
        rooms = result.unique().all()

        room_responses = []
        for room in rooms:
            user = await session.exec(select(User).where(User.uid == room.created_by))
            user = user.first()
            created_by_email = user.email if user else None
            attendees = len(room.members)
            room_response = RoomResponseModel(
                rid=room.rid,
                name=room.name,
                public=room.public,
                in_session=room.in_session,
                created_by=room.created_by,
                opens_at=room.opens_at,
                closes_at=room.closes_at,
                created_by_email=created_by_email,
                attendees=attendees,
            )
            room_responses.append(room_response)

        return room_responses

    async def join_room(self, room_member_data: RoomMemberModel, session: AsyncSession):
        room_member_data_dict = room_member_data.model_dump()

        # Check user exists
        user = select(User).where(User.uid == room_member_data_dict["user_id"])
        user = (await session.exec(user)).first()
        if user is None:
            raise UserNotFoundException

        # Check room exists
        room = (
            select(Room)
            .where(Room.rid == room_member_data_dict["room_id"])
            .options(selectinload(Room.members))
        )
        room = (await session.exec(room)).first()
        if room is None:
            raise RoomNotFoundException

        now = datetime.now().astimezone(room.opens_at.tzinfo)
        if now < room.opens_at:
            raise RoomNotSartedException(starting_time=room.opens_at.isoformat())

        if now > room.closes_at:
            raise RoomCloasedException(closing_time=room.closes_at.isoformat())

        # Check room capacity
        if len(room.members) >= 10:
            raise RoomFullException

        user_id = room_member_data_dict["user_id"]
        room_member = next(
            (member for member in room.members if member.user_id == user_id), None
        )

        # Handle private room access
        if not room.public:
            if room_member is None:
                raise PrivateRoomAccessDeniedException
            room_member.joint = True
            room_member.joined_at = datetime.now()
        else:
            if room_member is not None:
                # Update existing member's status instead of raising an error
                room_member.joint = True
                room_member.joined_at = datetime.now()
            else:
                room_member = RoomMember(
                    **room_member_data_dict, joint=True, joined_at=datetime.now()
                )
            session.add(room_member)

        await session.commit()
        return room_member

    async def update_room(self, room: Room, room_data: dict, session: AsyncSession):
        for k, v in room_data.items():
            setattr(room, k, v)

        await session.commit()

        return room

    async def get_all_room_members(self, rid: uuid.UUID, session: AsyncSession):
        statement = select(RoomMember).where(RoomMember.room_id == rid)

        result = await session.exec(statement)

        room_members = result.all()

        return room_members

    async def get_room_members_who_joined(self, rid: uuid.UUID, session: AsyncSession):
        statement = select(RoomMember).where(
            RoomMember.room_id == rid, RoomMember.joint
        )

        result = await session.exec(statement)

        room_members = result.all()

        return room_members

    async def get_all_room_members_emails(self, rid: uuid.UUID, session: AsyncSession):
        statement = select(User.email).join(RoomMember).where(RoomMember.room_id == rid)
        result = await session.exec(statement)
        room_members_emails = result.all()
        return room_members_emails
