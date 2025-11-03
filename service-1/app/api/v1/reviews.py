from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.review import Review
from app.models.product import Product
from app.models.user import User
from app.schemas.review import ReviewCreate, ReviewResponse, ReviewListResponse

router = APIRouter()


@router.post("/reviews", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
async def create_review(
    review_data: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    product = await Product.get_by_id(db, review_data.product_id)
    if not product or not product.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )
    
    if review_data.rating < 1 or review_data.rating > 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rating must be between 1 and 5",
        )
    
    existing_review = await Review.get_by_user_and_product(
        db, current_user.id, review_data.product_id
    )
    if existing_review:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Review already exists for this product",
        )
    
    new_review = Review(
        user_id=current_user.id,
        product_id=review_data.product_id,
        rating=review_data.rating,
        comment=review_data.comment,
        title=review_data.title,
    )
    db.add(new_review)
    await db.commit()
    await db.refresh(new_review)
    
    return ReviewResponse(
        id=new_review.id,
        user_id=new_review.user_id,
        product_id=new_review.product_id,
        rating=new_review.rating,
        comment=new_review.comment,
        title=new_review.title,
        created_at=new_review.created_at,
        user_name=current_user.full_name or current_user.email,
    )


@router.get("/reviews/product/{product_id}", response_model=ReviewListResponse)
async def get_product_reviews(
    product_id: int,
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
):
    skip = (page - 1) * page_size
    
    count_query = select(func.count()).select_from(Review).where(Review.product_id == product_id)
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0
    
    reviews = await Review.get_by_product(db, product_id, skip, page_size)
    average_rating = await Review.get_average_rating(db, product_id)
    
    review_responses = []
    for review in reviews:
        review_responses.append(
            ReviewResponse(
                id=review.id,
                user_id=review.user_id,
                product_id=review.product_id,
                rating=review.rating,
                comment=review.comment,
                title=review.title,
                created_at=review.created_at,
                user_name=None,
            )
        )
    
    return ReviewListResponse(
        items=review_responses,
        total=total,
        average_rating=average_rating,
    )

