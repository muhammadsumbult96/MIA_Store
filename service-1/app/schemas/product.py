from decimal import Decimal
from pydantic import BaseModel


class CategoryBase(BaseModel):
    name: str
    slug: str
    description: str | None = None


class CategoryCreate(CategoryBase):
    pass


class CategoryResponse(CategoryBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True


class ProductImageResponse(BaseModel):
    id: int
    image_url: str
    alt_text: str | None
    is_primary: bool
    display_order: int

    class Config:
        from_attributes = True


class ProductBase(BaseModel):
    name: str
    slug: str
    description: str | None = None
    price: Decimal
    discounted_price: Decimal | None = None
    stock_quantity: int = 0
    sku: str
    category_id: int


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    price: Decimal | None = None
    discounted_price: Decimal | None = None
    stock_quantity: int | None = None
    is_active: bool | None = None


class ProductResponse(ProductBase):
    id: int
    is_active: bool
    category: CategoryResponse | None = None
    images: list[ProductImageResponse] = []

    class Config:
        from_attributes = True


class ProductListResponse(BaseModel):
    items: list[ProductResponse]
    total: int
    page: int
    page_size: int
    total_pages: int

