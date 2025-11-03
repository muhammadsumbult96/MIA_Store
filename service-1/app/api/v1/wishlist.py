from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.wishlist import WishlistItem
from app.models.product import Product
from app.models.user import User
from app.schemas.wishlist import WishlistItemResponse

router = APIRouter()


@router.get("/wishlist", response_model=list[WishlistItemResponse])
async def get_wishlist(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    wishlist_items = await WishlistItem.get_by_user(db, current_user.id)
    
    items = []
    for item in wishlist_items:
        if item.product and item.product.is_active:
            product_response = {
                "id": item.product.id,
                "name": item.product.name,
                "slug": item.product.slug,
                "description": item.product.description,
                "price": str(item.product.price),
                "discounted_price": str(item.product.discounted_price) if item.product.discounted_price else None,
                "stock_quantity": item.product.stock_quantity,
                "sku": item.product.sku,
                "category_id": item.product.category_id,
                "is_active": item.product.is_active,
            }
            
            items.append(
                WishlistItemResponse(
                    id=item.id,
                    product=product_response,
                )
            )
    
    return items


@router.post("/wishlist/items", response_model=WishlistItemResponse, status_code=status.HTTP_201_CREATED)
async def add_to_wishlist(
    product_id: int = Query(..., description="Product ID to add to wishlist"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    product = await Product.get_by_id(db, product_id)
    if not product or not product.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )
    
    existing_item = await WishlistItem.get_by_user_and_product(
        db, current_user.id, product_id
    )
    
    if existing_item:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product already in wishlist",
        )
    
    new_item = WishlistItem(
        user_id=current_user.id,
        product_id=product_id,
    )
    db.add(new_item)
    await db.commit()
    await db.refresh(new_item)
    
    product_response = {
        "id": product.id,
        "name": product.name,
        "slug": product.slug,
        "description": product.description,
        "price": str(product.price),
        "discounted_price": str(product.discounted_price) if product.discounted_price else None,
        "stock_quantity": product.stock_quantity,
        "sku": product.sku,
        "category_id": product.category_id,
        "is_active": product.is_active,
    }
    
    return WishlistItemResponse(
        id=new_item.id,
        product=product_response,
    )


@router.delete("/wishlist/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_from_wishlist(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    wishlist_item = await WishlistItem.get_by_id(db, item_id)
    if not wishlist_item or wishlist_item.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Wishlist item not found",
        )
    
    await db.delete(wishlist_item)
    await db.commit()


@router.get("/wishlist/check/{product_id}")
async def check_wishlist(
    product_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    item = await WishlistItem.get_by_user_and_product(
        db, current_user.id, product_id
    )
    return {"in_wishlist": item is not None}

