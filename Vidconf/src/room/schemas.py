from datetime import datetime, timedelta
from typing import List, Optional
import uuid
from pydantic import BaseModel, Field


class RoomMemberModel(BaseModel):
    room_id: uuid.UUID
    user_id: uuid.UUID
    is_admin: Optional[bool] = False
    joint: Optional[bool] = False


class CreateRoomModel(BaseModel):
    name: str
    capacity: Optional[int] = Field(lt=11, gt=1)
    public: Optional[bool] = True
    in_session: Optional[bool] = False
    opens_at: Optional[datetime] = datetime.now()
    closes_at: Optional[datetime] = None
    created_by: uuid.UUID
    members: Optional[List[RoomMemberModel]] = []

    def __init__(self, **data) -> None:
        super().__init__(**data)
        if self.opens_at:
            self.closes_at = self.opens_at + timedelta(hours=1)

    class Config:
        populate_by_name = True
