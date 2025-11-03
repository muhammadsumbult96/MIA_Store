from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.order import Order, PaymentStatus
from app.models.user import User
from app.schemas.payment import PaymentRequest, PaymentResponse
from app.services.payment.vnpay import get_payment_provider

router = APIRouter()


@router.post("/payments/create", response_model=PaymentResponse)
async def create_payment(
    payment_data: PaymentRequest,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    order = await Order.get_by_order_number(db, payment_data.order_number)
    if not order or order.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )

    if order.payment_status == PaymentStatus.PAID:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order already paid",
        )

    client_ip = request.client.host if request.client else "127.0.0.1"
    
    provider = get_payment_provider()
    payment_url = await provider.create_payment_url(
        amount=order.total,
        order_id=order.order_number,
        order_info=f"Payment for order {order.order_number}",
        return_url=payment_data.return_url,
        ip_addr=client_ip,
    )

    return PaymentResponse(payment_url=payment_url)


@router.get("/payments/callback")
async def payment_callback(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    query_params = dict(request.query_params)
    
    provider = get_payment_provider()
    result = await provider.verify_payment_callback(query_params)

    if not result.get("success"):
        return {
            "success": False,
            "message": result.get("message", "Payment verification failed"),
        }

    order_number = result.get("order_id")
    if not order_number:
        return {
            "success": False,
            "message": "Order number not found",
        }

    order = await Order.get_by_order_number(db, order_number)
    if not order:
        return {
            "success": False,
            "message": "Order not found",
        }

    if order.payment_status != PaymentStatus.PAID:
        order.payment_status = PaymentStatus.PAID
        await db.commit()
        await db.refresh(order)

    return {
        "success": True,
        "order_number": order_number,
        "message": "Payment successful",
    }

