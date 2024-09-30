from datetime import datetime
from typing import Optional
import uuid
from pydantic import BaseModel, Field


class CreateRoomModel(BaseModel):
    name: Optional[str]
    capacity: Optional[int] = Field(lt=11, gt=2)
    public: Optional[bool]
    in_session: Optional[bool]
    opens_at: Optional[datetime]
    created_by: uuid.UUID
    members: Optional[list[uuid.UUID]]
