from decimal import Decimal
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_

from app.models.product import Product, Category


async def get_products_with_filters(
    db: AsyncSession,
    category_id: int | None = None,
    search: str | None = None,
    min_price: Decimal | None = None,
    max_price: Decimal | None = None,
    skip: int = 0,
    limit: int = 20,
):
    query = select(Product).where(Product.is_active == True)

    if category_id:
        query = query.where(Product.category_id == category_id)

    if search:
        search_filter = or_(
            Product.name.ilike(f"%{search}%"),
            Product.description.ilike(f"%{search}%"),
        )
        query = query.where(search_filter)

    if min_price is not None:
        query = query.where(Product.price >= min_price)

    if max_price is not None:
        query = query.where(Product.price <= max_price)

    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


async def get_products_count(
    db: AsyncSession,
    category_id: int | None = None,
    search: str | None = None,
    min_price: Decimal | None = None,
    max_price: Decimal | None = None,
) -> int:
    count_query = select(func.count()).select_from(Product).where(Product.is_active == True)

    if category_id:
        count_query = count_query.where(Product.category_id == category_id)

    if search:
        search_filter = or_(
            Product.name.ilike(f"%{search}%"),
            Product.description.ilike(f"%{search}%"),
        )
        count_query = count_query.where(search_filter)

    if min_price is not None:
        count_query = count_query.where(Product.price >= min_price)

    if max_price is not None:
        count_query = count_query.where(Product.price <= max_price)

    result = await db.execute(count_query)
    return result.scalar() or 0


async def search_products(
    db: AsyncSession,
    query: str,
    limit: int = 10,
) -> list[Product]:
    search_filter = or_(
        Product.name.ilike(f"%{query}%"),
        Product.description.ilike(f"%{query}%"),
        Product.sku.ilike(f"%{query}%"),
    )
    
    result = await db.execute(
        select(Product)
        .where(Product.is_active == True)
        .where(search_filter)
        .limit(limit)
    )
    return result.scalars().all()

