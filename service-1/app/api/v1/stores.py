from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.store import Store
from app.schemas.store import StoreResponse

router = APIRouter()


@router.get("/stores", response_model=list[StoreResponse])
async def get_stores(
    db: AsyncSession = Depends(get_db),
):
    stores = await Store.get_all_active(db)
    return [StoreResponse.model_validate(store) for store in stores]

