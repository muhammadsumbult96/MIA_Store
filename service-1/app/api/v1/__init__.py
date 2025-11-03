from fastapi import APIRouter

from app.api.v1 import auth, health, users, products, cart, orders, payments, wishlist, reviews, stores, search

api_router = APIRouter()

api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(products.router, tags=["products"])
api_router.include_router(search.router, tags=["search"])
api_router.include_router(cart.router, tags=["cart"])
api_router.include_router(orders.router, tags=["orders"])
api_router.include_router(payments.router, tags=["payments"])
api_router.include_router(wishlist.router, tags=["wishlist"])
api_router.include_router(reviews.router, tags=["reviews"])
api_router.include_router(stores.router, tags=["stores"])
