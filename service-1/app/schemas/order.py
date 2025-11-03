from decimal import Decimal
from datetime import datetime
from pydantic import BaseModel, EmailStr

from app.models.order import OrderStatus, PaymentStatus


class OrderItemBase(BaseModel):
    product_id: int
    quantity: int


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: str
    product_sku: str
    quantity: int
    unit_price: Decimal
    total_price: Decimal

    class Config:
        from_attributes = True


class ShippingInfo(BaseModel):
    shipping_name: str
    shipping_phone: str
    shipping_address: str
    shipping_city: str
    shipping_postal_code: str | None = None


class OrderCreate(BaseModel):
    items: list[OrderItemBase]
    shipping_info: ShippingInfo
    notes: str | None = None


class OrderResponse(BaseModel):
    id: int
    order_number: str
    status: OrderStatus
    payment_status: PaymentStatus
    shipping_name: str
    shipping_phone: str
    shipping_address: str
    shipping_city: str
    shipping_postal_code: str | None
    subtotal: Decimal
    shipping_fee: Decimal
    total: Decimal
    notes: str | None
    created_at: datetime
    items: list[OrderItemResponse]

    class Config:
        from_attributes = True


class OrderListResponse(BaseModel):
    items: list[OrderResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class OrderUpdate(BaseModel):
    status: OrderStatus | None = None
    payment_status: PaymentStatus | None = None

