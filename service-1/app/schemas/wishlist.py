from pydantic import BaseModel

from app.schemas.product import ProductResponse


class WishlistItemResponse(BaseModel):
    id: int
    product: ProductResponse

    class Config:
        from_attributes = True

