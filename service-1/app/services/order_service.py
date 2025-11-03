from decimal import Decimal
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.order import Order, OrderItem, OrderStatus, PaymentStatus
from app.schemas.order import OrderCreate


async def generate_order_number() -> str:
    import uuid
    return f"ORD-{uuid.uuid4().hex[:8].upper()}"


async def create_order_from_cart(
    db: AsyncSession,
    user_id: int,
    order_data: OrderCreate,
) -> Order:
    from app.models.cart import CartItem
    
    cart_items = await CartItem.get_by_user(db, user_id)
    
    if not cart_items:
        raise ValueError("Cart is empty")
    
    order_number = await generate_order_number()
    
    subtotal = Decimal("0")
    order_items = []
    
    for cart_item in cart_items:
        product = await Product.get_by_id(db, cart_item.product_id)
        if not product or not product.is_active:
            continue
        
        if product.stock_quantity < cart_item.quantity:
            raise ValueError(f"Insufficient stock for product {product.name}")
        
        unit_price = product.discounted_price or product.price
        total_price = Decimal(str(unit_price)) * cart_item.quantity
        subtotal += total_price
        
        order_item = OrderItem(
            product_id=product.id,
            product_name=product.name,
            product_sku=product.sku,
            quantity=cart_item.quantity,
            unit_price=Decimal(str(unit_price)),
            total_price=total_price,
        )
        order_items.append(order_item)
        
        product.stock_quantity -= cart_item.quantity
    
    shipping_fee = Decimal("0")
    total = subtotal + shipping_fee
    
    order = Order(
        user_id=user_id,
        order_number=order_number,
        status=OrderStatus.PENDING,
        payment_status=PaymentStatus.PENDING,
        shipping_name=order_data.shipping_info.shipping_name,
        shipping_phone=order_data.shipping_info.shipping_phone,
        shipping_address=order_data.shipping_info.shipping_address,
        shipping_city=order_data.shipping_info.shipping_city,
        shipping_postal_code=order_data.shipping_info.shipping_postal_code,
        subtotal=subtotal,
        shipping_fee=shipping_fee,
        total=total,
        notes=order_data.notes,
        items=order_items,
    )
    
    db.add(order)
    
    for cart_item in cart_items:
        await db.delete(cart_item)
    
    await db.commit()
    await db.refresh(order)
    
    return order

