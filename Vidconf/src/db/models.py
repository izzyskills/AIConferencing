import uuid
from datetime import date, datetime, timedelta
from typing import List, Optional

import sqlalchemy.dialects.postgresql as pg
from sqlmodel import CheckConstraint, Column, Enum, Field, Relationship, SQLModel

from src.db.utils import DateTimeString


class User(SQLModel, table=True):
    uid: uuid.UUID = Field(
        sa_column=Column(pg.UUID, nullable=False, primary_key=True, default=uuid.uuid4)
    )
    email: str
    first_name: str
    last_name: str
    role: str = Field(
        sa_column=Column(pg.VARCHAR, nullable=False, server_default="user")
    )
    is_verified: bool = Field(default=False)
    password_hash: str = Field(
        sa_column=Column(pg.VARCHAR, nullable=True), exclude=True
    )
    created_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, default=datetime.now))
    update_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, default=datetime.now))
    rooms: Optional[List["Room"]] = Relationship(back_populates="created_by_user")
    room_members: Optional[List["RoomMember"]] = Relationship(back_populates="user")


class Room(SQLModel, table=True):
    rid: uuid.UUID = Field(
        sa_column=Column(pg.UUID, nullable=False, primary_key=True, default=uuid.uuid4)
    )
    name: Optional[str] = None
    public: bool = Field(default=True)
    in_session: bool = Field(default=False)
    created_by: uuid.UUID = Field(foreign_key="user.uid")
    ended_at: Optional[datetime] = None
    opens_at: datetime = Field(sa_column=Column(DateTimeString))
    closes_at: datetime = Field(sa_column=Column(DateTimeString))
    # current_state: Column[str] = Column(
    #     Enum("scheduled", "active", "ended", name="room_states"), default="scheduled"
    # )
    created_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, default=datetime.now))
    update_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, default=datetime.now))
    created_by_user: User = Relationship(back_populates="rooms")
    members: List["RoomMember"] = Relationship(back_populates="room")
    extracts: Optional["MeetingExtracts"] = Relationship(back_populates="room")


class RoomMember(SQLModel, table=True):
    id: uuid.UUID = Field(
        sa_column=Column(pg.UUID, nullable=False, primary_key=True, default=uuid.uuid4)
    )
    room_id: uuid.UUID = Field(foreign_key="room.rid", primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.uid", primary_key=True)
    is_admin: bool = Field(default=False)
    joint: bool = Field(default=False)
    joined_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, default=datetime.now))
    created_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, default=datetime.now))
    update_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, default=datetime.now))
    room: Room = Relationship(back_populates="members")
    user: User = Relationship(back_populates="room_members")


class MeetingExtracts(SQLModel, table=True):
    id: uuid.UUID = Field(
        sa_column=Column(pg.UUID, nullable=False, primary_key=True, default=uuid.uuid4)
    )
    room_id: uuid.UUID = Field(foreign_key="room.rid", primary_key=True)
    transcript_link: str
    summary_link: str
    created_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, default=datetime.now))
    update_at: datetime = Field(sa_column=Column(pg.TIMESTAMP, default=datetime.now))
    room: Room = Relationship(back_populates="extracts")
