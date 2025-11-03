from sqlalchemy import Column, Integer, ForeignKey, Numeric, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import relationship

from app.models.base import BaseModel
from app.models.product import Product
from app.models.user import User


class CartItem(BaseModel):
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("product.id"), nullable=False)
    quantity = Column(Integer, default=1, nullable=False)
    
    user = relationship("User")
    product = relationship("Product")

    @classmethod
    async def get_by_user(cls, db: AsyncSession, user_id: int):
        result = await db.execute(
            select(cls).where(cls.user_id == user_id).join(Product)
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

