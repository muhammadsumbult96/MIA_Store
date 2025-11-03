from sqlalchemy import Column, Integer, ForeignKey, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.base import BaseModel
from app.models.product import Product
from app.models.user import User


class WishlistItem(BaseModel):
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("product.id"), nullable=False)
    
    user = relationship("User")
    product = relationship("Product")

    @classmethod
    async def get_by_user(cls, db: AsyncSession, user_id: int):
        result = await db.execute(
            select(cls)
            .where(cls.user_id == user_id)
            .join(Product)
            .where(Product.is_active == True)
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

