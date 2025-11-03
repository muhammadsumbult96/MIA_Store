from decimal import Decimal
from pydantic import BaseModel

from app.schemas.product import ProductResponse


class CartItemBase(BaseModel):
    product_id: int
    quantity: int


class CartItemCreate(CartItemBase):
    pass


class CartItemUpdate(BaseModel):
    quantity: int


class CartItemResponse(BaseModel):
    id: int
    product: ProductResponse
    quantity: int

    class Config:
        from_attributes = True


class CartResponse(BaseModel):
    items: list[CartItemResponse]
    total_items: int
    total_price: Decimal

