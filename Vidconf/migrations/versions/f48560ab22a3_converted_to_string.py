"""converted to string

Revision ID: f48560ab22a3
Revises: 2aa3eb641e2e
Create Date: 2024-10-06 09:57:42.351728

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel
from sqlalchemy.dialects import postgresql

from src.db.utils import DateTimeString


# revision identifiers, used by Alembic.
revision: str = "f48560ab22a3"
down_revision: Union[str, None] = "2aa3eb641e2e"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column(
        "room",
        "opens_at",
        existing_type=postgresql.TIMESTAMP(),
        type_=DateTimeString(),
        existing_nullable=True,
    )
    op.alter_column(
        "room",
        "closes_at",
        existing_type=postgresql.TIMESTAMP(),
        type_=DateTimeString(),
        existing_nullable=True,
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column(
        "room",
        "closes_at",
        existing_type=DateTimeString(),
        type_=postgresql.TIMESTAMP(),
        existing_nullable=True,
    )
    op.alter_column(
        "room",
        "opens_at",
        existing_type=DateTimeString(),
        type_=postgresql.TIMESTAMP(),
        existing_nullable=True,
    )
    # ### end Alembic commands ###
