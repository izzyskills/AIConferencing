from datetime import datetime
from typing import List, Optional
import uuid
from pydantic import BaseModel, Field


class RoomMemberModel(BaseModel):
    room_id: uuid.UUID
    user_id: uuid.UUID
    is_admin: Optional[bool]
    joint: Optional[bool]


class CreateRoomModel(BaseModel):
    name: Optional[str]
    capacity: Optional[int] = Field(lt=11, gt=1)
    public: Optional[bool]
    in_session: Optional[bool]
    opens_at: Optional[datetime]
    created_by: uuid.UUID
    members: Optional[List[RoomMemberModel]]
