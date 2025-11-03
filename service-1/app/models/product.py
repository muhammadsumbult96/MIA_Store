from sqlalchemy import Column, String, Integer, Numeric, Text, Boolean, ForeignKey, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import relationship

from app.models.base import BaseModel


class Category(BaseModel):
    name = Column(String, nullable=False, index=True)
    slug = Column(String, unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)

    products = relationship("Product", back_populates="category")


class Product(BaseModel):
    name = Column(String, nullable=False, index=True)
    slug = Column(String, unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    price = Column(Numeric(10, 2), nullable=False)
    discounted_price = Column(Numeric(10, 2), nullable=True)
    stock_quantity = Column(Integer, default=0, nullable=False)
    sku = Column(String, unique=True, nullable=False, index=True)
    category_id = Column(Integer, ForeignKey("category.id"), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    
    category = relationship("Category", back_populates="products")
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan")

    @classmethod
    async def get_by_slug(cls, db: AsyncSession, slug: str):
        result = await db.execute(select(cls).where(cls.slug == slug))
        return result.scalar_one_or_none()

    @classmethod
    async def get_by_category(
        cls, db: AsyncSession, category_id: int, skip: int = 0, limit: int = 20
    ):
        result = await db.execute(
            select(cls)
            .where(cls.category_id == category_id, cls.is_active == True)
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()


class ProductImage(BaseModel):
    product_id = Column(Integer, ForeignKey("product.id"), nullable=False)
    image_url = Column(String, nullable=False)
    alt_text = Column(String, nullable=True)
    is_primary = Column(Boolean, default=False, nullable=False)
    display_order = Column(Integer, default=0, nullable=False)

    product = relationship("Product", back_populates="images")

