from sqlalchemy import Column, Integer, String, Text, Numeric, ForeignKey, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import relationship

from app.models.base import BaseModel
from app.models.product import Product
from app.models.user import User


class Review(BaseModel):
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("product.id"), nullable=False)
    rating = Column(Numeric(2, 1), nullable=False)
    comment = Column(Text, nullable=True)
    title = Column(String, nullable=True)
    
    user = relationship("User")
    product = relationship("Product")

    @classmethod
    async def get_by_product(
        cls, db: AsyncSession, product_id: int, skip: int = 0, limit: int = 20
    ):
        result = await db.execute(
            select(cls)
            .where(cls.product_id == product_id)
            .order_by(cls.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

    @classmethod
    async def get_by_user_and_product(
        cls, db: AsyncSession, user_id: int, product_id: int
    ):
        result = await db.execute(
            select(cls).where(
                cls.user_id == user_id, cls.product_id == product_id
            )
        )
        return result.scalar_one_or_none()

    @classmethod
    async def get_average_rating(cls, db: AsyncSession, product_id: int):
        from sqlalchemy import func
        
        result = await db.execute(
            select(func.avg(cls.rating))
            .where(cls.product_id == product_id)
        )
        return result.scalar() or 0

