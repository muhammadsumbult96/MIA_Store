from sqlalchemy import Column, String, Integer, Numeric, Text, Enum as SQLEnum, ForeignKey, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import relationship
import enum

from app.models.base import BaseModel


class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"
    REFUNDED = "refunded"


class Order(BaseModel):
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    order_number = Column(String, unique=True, nullable=False, index=True)
    status = Column(SQLEnum(OrderStatus), default=OrderStatus.PENDING, nullable=False)
    payment_status = Column(SQLEnum(PaymentStatus), default=PaymentStatus.PENDING, nullable=False)
    
    # Shipping information
    shipping_name = Column(String, nullable=False)
    shipping_phone = Column(String, nullable=False)
    shipping_address = Column(Text, nullable=False)
    shipping_city = Column(String, nullable=False)
    shipping_postal_code = Column(String, nullable=True)
    
    # Pricing
    subtotal = Column(Numeric(10, 2), nullable=False)
    shipping_fee = Column(Numeric(10, 2), default=0, nullable=False)
    total = Column(Numeric(10, 2), nullable=False)
    
    # Notes
    notes = Column(Text, nullable=True)
    
    user = relationship("User")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

    @classmethod
    async def get_by_user(cls, db: AsyncSession, user_id: int, skip: int = 0, limit: int = 20):
        result = await db.execute(
            select(cls)
            .where(cls.user_id == user_id)
            .order_by(cls.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

    @classmethod
    async def get_by_order_number(cls, db: AsyncSession, order_number: str):
        result = await db.execute(
            select(cls).where(cls.order_number == order_number)
        )
        return result.scalar_one_or_none()


class OrderItem(BaseModel):
    order_id = Column(Integer, ForeignKey("order.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("product.id"), nullable=False)
    product_name = Column(String, nullable=False)
    product_sku = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Numeric(10, 2), nullable=False)
    total_price = Column(Numeric(10, 2), nullable=False)
    
    order = relationship("Order", back_populates="items")
    product = relationship("Product")

