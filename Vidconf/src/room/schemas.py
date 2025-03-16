from datetime import datetime, timedelta
from typing import List, Optional
import uuid
from pydantic import BaseModel, Field


class MeetingExtractsCreate(BaseModel):
    room_id: uuid.UUID
    file_path: str
    created_at: datetime
    update_at: datetime


class MeetingExtractsResponse(BaseModel):
    id: uuid.UUID
    room_id: uuid.UUID
    file_path: str
    created_at: datetime
    update_at: datetime

    class Config:
        from_attributes = True


class RoomMemberModel(BaseModel):
    room_id: Optional[uuid.UUID]
    user_id: uuid.UUID
    is_admin: Optional[bool] = False
    joint: Optional[bool] = False


class CreateRoomModel(BaseModel):
    name: str
    public: Optional[bool] = True
    in_session: Optional[bool] = False
    opens_at: Optional[datetime] = datetime.now()
    closes_at: Optional[datetime] = None
    created_by: uuid.UUID
    members: Optional[List[str]] = []

    def __init__(self, **data) -> None:
        super().__init__(**data)
        if self.opens_at:
            self.closes_at = self.opens_at + timedelta(hours=1)

    class Config:
        populate_by_name = True


class RoomResponseModel(BaseModel):
    rid: uuid.UUID
    name: str
    public: bool
    in_session: bool
    created_by: uuid.UUID
    opens_at: datetime
    closes_at: datetime
    created_by_email: Optional[str]
    attendees: int

    class Config:
        from_attributes = True
