from src.db.models import User
from src.room.schemas import RoomMemberModel
from sqlmodel import select


async def convert_email_to_RoomMemberModel(
    session, email, room_id, is_admin=False, joint=False
):
    user = select(User).where(User.email == email)
    user = (await session.exec(user)).first()
    if user is None:
        return None
    return RoomMemberModel(
        room_id=room_id, user_id=user.uid, is_admin=is_admin, joint=joint
    )
