from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services.product_service import search_products
from app.schemas.product import ProductResponse

router = APIRouter()


@router.get("/search", response_model=list[ProductResponse])
async def search(
    q: str = Query(..., min_length=1, description="Search query"),
    limit: int = Query(10, ge=1, le=50, description="Maximum number of results"),
    db: AsyncSession = Depends(get_db),
):
    products = await search_products(db, q, limit)
    return [ProductResponse.model_validate(p) for p in products]

