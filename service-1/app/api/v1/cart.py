from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.cart import CartItem
from app.models.product import Product
from app.models.user import User
from app.schemas.cart import CartItemCreate, CartItemUpdate, CartItemResponse, CartResponse

router = APIRouter()


@router.get("/cart", response_model=CartResponse)
async def get_cart(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    cart_items = await CartItem.get_by_user(db, current_user.id)
    
    items = []
    total_price = Decimal("0")
    
    for item in cart_items:
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
            
            price = item.product.discounted_price or item.product.price
            items.append(
                CartItemResponse(
                    id=item.id,
                    product=product_response,
                    quantity=item.quantity,
                )
            )
            total_price += Decimal(str(price)) * item.quantity
    
    return CartResponse(
        items=items,
        total_items=sum(item.quantity for item in items),
        total_price=total_price,
    )


@router.post("/cart/items", response_model=CartItemResponse, status_code=status.HTTP_201_CREATED)
async def add_to_cart(
    cart_item: CartItemCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    product = await Product.get_by_id(db, cart_item.product_id)
    if not product or not product.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )
    
    if product.stock_quantity < cart_item.quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient stock",
        )
    
    existing_item = await CartItem.get_by_user_and_product(
        db, current_user.id, cart_item.product_id
    )
    
    if existing_item:
        new_quantity = existing_item.quantity + cart_item.quantity
        if product.stock_quantity < new_quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Insufficient stock",
            )
        existing_item.quantity = new_quantity
        await db.commit()
        await db.refresh(existing_item)
        
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
        
        return CartItemResponse(
            id=existing_item.id,
            product=product_response,
            quantity=existing_item.quantity,
        )
    
    new_item = CartItem(
        user_id=current_user.id,
        product_id=cart_item.product_id,
        quantity=cart_item.quantity,
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
    
    return CartItemResponse(
        id=new_item.id,
        product=product_response,
        quantity=new_item.quantity,
    )


@router.patch("/cart/items/{item_id}", response_model=CartItemResponse)
async def update_cart_item(
    item_id: int,
    cart_item_update: CartItemUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    cart_item = await CartItem.get_by_id(db, item_id)
    if not cart_item or cart_item.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart item not found",
        )
    
    product = await Product.get_by_id(db, cart_item.product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )
    
    if product.stock_quantity < cart_item_update.quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient stock",
        )
    
    cart_item.quantity = cart_item_update.quantity
    await db.commit()
    await db.refresh(cart_item)
    
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
    
    return CartItemResponse(
        id=cart_item.id,
        product=product_response,
        quantity=cart_item.quantity,
    )


@router.delete("/cart/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_from_cart(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    cart_item = await CartItem.get_by_id(db, item_id)
    if not cart_item or cart_item.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart item not found",
        )
    
    await db.delete(cart_item)
    await db.commit()

