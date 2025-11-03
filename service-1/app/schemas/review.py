from decimal import Decimal
from datetime import datetime
from pydantic import BaseModel


class ReviewBase(BaseModel):
    rating: Decimal
    comment: str | None = None
    title: str | None = None


class ReviewCreate(ReviewBase):
    product_id: int


class ReviewResponse(ReviewBase):
    id: int
    user_id: int
    product_id: int
    created_at: datetime
    user_name: str | None = None

    class Config:
        from_attributes = True


class ReviewListResponse(BaseModel):
    items: list[ReviewResponse]
    total: int
    average_rating: Decimal

