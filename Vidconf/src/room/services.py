import uuid
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from src.db.models import Room, RoomMember, User
from .schemas import CreateRoomModel, RoomMemberModel


class RoomService:
    async def create_room(self, room_data: CreateRoomModel, session: AsyncSession):
        room_data_dict = room_data.model_dump()
        room_admin = room_data_dict["created_by"]
        user = select(User).where(User.uid == room_admin)
        user = (await session.exec(user)).first()
        if user is None:
            raise ValueError("User not found")
        new_room = Room(**room_data_dict)
        # a check to ensure that the the room admin is part of the room room_members
        if new_room.members:
            if new_room.created_by not in [
                member.user_id for member in new_room.members
            ]:
                new_room.members.append(
                    RoomMember(
                        **{
                            "room_id": new_room.rid,
                            "user_id": new_room.created_by,
                            "is_admin": True,
                            "joint": True,
                        }
                    )
                )
        else:
            new_room.members = [
                RoomMember(
                    **{
                        "room_id": new_room.rid,
                        "user_id": new_room.created_by,
                        "is_admin": True,
                        "joint": True,
                    }
                )
            ]

        session.add(new_room)

        await session.commit()

        return new_room

    async def get_room_by_id(self, rid: uuid.UUID, session: AsyncSession):
        statement = select(Room).where(Room.rid == rid)

        result = await session.exec(statement)

        room = result.first()

        return room

    async def join_room(self, room_member_data: RoomMemberModel, session: AsyncSession):
        room_member_data_dict = room_member_data.model_dump()
        user = select(User).where(User.uid == room_member_data_dict["user_id"])
        user = (await session.exec(user)).first()
        if user is None:
            raise ValueError("User not found")
        room = select(Room).where(Room.rid == room_member_data_dict["room_id"])
        room = (await session.exec(room)).first()
        if room is None:
            raise ValueError("Room not found")
        if room.capacity <= len(room.members):
            raise ValueError("Room is full")
        if not room.public:
            raise ValueError("Room is private")

        room_member = select(RoomMember).where(
            RoomMember.room_id == room_member_data_dict["room_id"],
            RoomMember.user_id == room_member_data_dict["user_id"],
        )
        room_member = (await session.exec(room_member)).first()
        if room_member is not None:
            raise ValueError("User already in room")
        new_room_member = RoomMember(**room_member_data_dict)

        session.add(new_room_member)

        await session.commit()

        return new_room_member

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
