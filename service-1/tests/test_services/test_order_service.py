import pytest
from decimal import Decimal
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.order import Order
from app.models.cart import CartItem
from app.models.product import Product
from app.models.user import User
from app.schemas.order import OrderCreate, ShippingInfo
from app.services.order_service import create_order_from_cart, generate_order_number


@pytest.mark.asyncio
async def test_generate_order_number():
    order_number = await generate_order_number()
    assert order_number.startswith("ORD-")
    assert len(order_number) == 12


@pytest.mark.asyncio
async def test_generate_unique_order_numbers():
    order_number1 = await generate_order_number()
    order_number2 = await generate_order_number()
    assert order_number1 != order_number2


@pytest.mark.asyncio
async def test_create_order_from_cart_success(db: AsyncSession, test_user: User):
    product = Product(
        name="Test Product",
        slug="test-product",
        price=Decimal("100000"),
        stock_quantity=10,
        sku="TEST-001",
        category_id=1,
        is_active=True,
    )
    db.add(product)
    await db.commit()
    await db.refresh(product)

    cart_item = CartItem(
        user_id=test_user.id,
        product_id=product.id,
        quantity=2,
    )
    db.add(cart_item)
    await db.commit()

    order_data = OrderCreate(
        items=[{"product_id": product.id, "quantity": 2}],
        shipping_info=ShippingInfo(
            shipping_name="Test User",
            shipping_phone="0123456789",
            shipping_address="123 Test St",
            shipping_city="Ho Chi Minh",
        ),
    )

    order = await create_order_from_cart(db, test_user.id, order_data)

    assert order is not None
    assert order.user_id == test_user.id
    assert order.total == Decimal("200000")
    assert len(order.items) == 1

    await db.refresh(product)
    assert product.stock_quantity == 8

    cart_items = await CartItem.get_by_user(db, test_user.id)
    assert len(cart_items) == 0


@pytest.mark.asyncio
async def test_create_order_from_empty_cart(db: AsyncSession, test_user: User):
    order_data = OrderCreate(
        items=[],
        shipping_info=ShippingInfo(
            shipping_name="Test User",
            shipping_phone="0123456789",
            shipping_address="123 Test St",
            shipping_city="Ho Chi Minh",
        ),
    )

    with pytest.raises(ValueError, match="Cart is empty"):
        await create_order_from_cart(db, test_user.id, order_data)


@pytest.mark.asyncio
async def test_create_order_insufficient_stock(db: AsyncSession, test_user: User):
    product = Product(
        name="Test Product",
        slug="test-product",
        price=Decimal("100000"),
        stock_quantity=1,
        sku="TEST-001",
        category_id=1,
        is_active=True,
    )
    db.add(product)
    await db.commit()
    await db.refresh(product)

    cart_item = CartItem(
        user_id=test_user.id,
        product_id=product.id,
        quantity=5,
    )
    db.add(cart_item)
    await db.commit()

    order_data = OrderCreate(
        items=[{"product_id": product.id, "quantity": 5}],
        shipping_info=ShippingInfo(
            shipping_name="Test User",
            shipping_phone="0123456789",
            shipping_address="123 Test St",
            shipping_city="Ho Chi Minh",
        ),
    )

    with pytest.raises(ValueError, match="Insufficient stock"):
        await create_order_from_cart(db, test_user.id, order_data)

