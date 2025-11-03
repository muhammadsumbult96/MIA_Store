from pydantic import BaseModel


class PaymentRequest(BaseModel):
    order_number: str
    return_url: str


class PaymentResponse(BaseModel):
    payment_url: str

