from sqlalchemy import Column, String, Boolean, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.base import BaseModel


class User(BaseModel):
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    is_superuser = Column(Boolean, default=False, nullable=False)

    @classmethod
    async def get_by_email(cls, db: AsyncSession, email: str):
        result = await db.execute(select(cls).where(cls.email == email))
        return result.scalar_one_or_none()

