from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_

from app.core.database import get_db
from app.models.product import Product, Category
from app.schemas.product import (
    ProductResponse,
    ProductListResponse,
    ProductCreate,
    ProductUpdate,
)

router = APIRouter()


@router.get("/products", response_model=ProductListResponse)
async def get_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    category_id: int | None = Query(None),
    search: str | None = Query(None),
    min_price: float | None = Query(None),
    max_price: float | None = Query(None),
    db: AsyncSession = Depends(get_db),
):
    skip = (page - 1) * page_size
    
    query = select(Product).where(Product.is_active == True)
    count_query = select(func.count()).select_from(Product).where(Product.is_active == True)
    
    if category_id:
        query = query.where(Product.category_id == category_id)
        count_query = count_query.where(Product.category_id == category_id)
    
    if search:
        search_filter = or_(
            Product.name.ilike(f"%{search}%"),
            Product.description.ilike(f"%{search}%"),
        )
        query = query.where(search_filter)
        count_query = count_query.where(search_filter)
    
    if min_price is not None:
        query = query.where(Product.price >= min_price)
        count_query = count_query.where(Product.price >= min_price)
    
    if max_price is not None:
        query = query.where(Product.price <= max_price)
        count_query = count_query.where(Product.price <= max_price)
    
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0
    
    query = query.offset(skip).limit(page_size)
    result = await db.execute(query)
    products = result.scalars().all()
    
    total_pages = (total + page_size - 1) // page_size
    
    return ProductListResponse(
        items=[ProductResponse.model_validate(p) for p in products],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.get("/products/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: int,
    db: AsyncSession = Depends(get_db),
):
    product = await Product.get_by_id(db, product_id)
    if not product or not product.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )
    return ProductResponse.model_validate(product)


@router.get("/products/slug/{slug}", response_model=ProductResponse)
async def get_product_by_slug(
    slug: str,
    db: AsyncSession = Depends(get_db),
):
    product = await Product.get_by_slug(db, slug)
    if not product or not product.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )
    return ProductResponse.model_validate(product)


@router.get("/categories", response_model=list[dict])
async def get_categories(
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Category).where(Category.is_active == True))
    categories = result.scalars().all()
    return [{"id": c.id, "name": c.name, "slug": c.slug} for c in categories]

