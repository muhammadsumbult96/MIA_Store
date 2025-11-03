from sqlalchemy import Column, String, Text, Numeric, Boolean, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.base import BaseModel


class Store(BaseModel):
    name = Column(String, nullable=False)
    address = Column(Text, nullable=False)
    city = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    latitude = Column(Numeric(10, 7), nullable=True)
    longitude = Column(Numeric(10, 7), nullable=True)
    opening_hours = Column(String, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)

    @classmethod
    async def get_all_active(cls, db: AsyncSession):
        result = await db.execute(
            select(cls).where(cls.is_active == True)
        )
        return result.scalars().all()

