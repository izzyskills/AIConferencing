from datetime import datetime, timedelta
import uuid
from sqlalchemy.orm import joinedload, selectinload
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from src.db.models import Room, RoomMember, User
from src.errors import (
    PrivateRoomAccessDeniedException,
    RoomFullException,
    RoomNotFoundException,
    UserAlreadyInRoomException,
    UserNotFoundException,
)
from src.room.utils import convert_email_to_RoomMemberModel
from .schemas import CreateRoomModel, RoomMemberModel


class RoomService:
    async def create_room(self, room_data: CreateRoomModel, session: AsyncSession):
        room_data_dict = room_data.model_dump(exclude={"members"})

        # Get the user by UUID
        created_by_uuid = room_data_dict["created_by"]
        user = await session.exec(select(User).where(User.uid == created_by_uuid))
        user = user.first()
        if user is None:
            raise ValueError(f"User with UUID {created_by_uuid} not found")

        creator_email = user.email
        new_room = Room(**room_data_dict)
        session.add(new_room)

        # Convert member emails to RoomMemberModel objects
        member_emails = room_data_dict.get("members", [])
        new_room.members = []

        for email in member_emails:
            is_admin = email == creator_email
            member = await convert_email_to_RoomMemberModel(
                session, email, new_room.rid, is_admin=is_admin, joint=is_admin
            )
            if member:
                new_room.members.append(RoomMember(**member.model_dump()))

        # Ensure the creator is always a member and admin
        if not any(member.user_id == user.uid for member in new_room.members):
            new_room.members.append(
                RoomMember(
                    **{
                        "room_id": new_room.rid,
                        "user_id": user.uid,
                        "is_admin": True,
                        "joint": True,
                    }
                )
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
        return result.unique().all()

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
        print(room)
        if room is None:
            raise RoomNotFoundException

        # Check room capacity
        if len(room.members) >= 10:
            raise RoomFullException

        user_id = room_member_data_dict["user_id"]
        room_member = next(
            (member for member in room.members if member.user_id == user_id), None
        )

        print(room_member)
        # Handle private room access
        if not room.public:
            if room_member is None:
                raise PrivateRoomAccessDeniedException
            room_member.joint = True
            room_member.joined_at = datetime.now()
        else:
            print("public room ")
            if room_member is not None:
                # Update existing member's status instead of raising an error
                room_member.joint = True
                room_member.joined_at = datetime.now()
                print("room member is not none")
            else:
                room_member = RoomMember(
                    **room_member_data_dict, joint=True, joined_at=datetime.now()
                )
                print("room member created" + str(room_member))
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
