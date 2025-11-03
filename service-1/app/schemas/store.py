from decimal import Decimal
from pydantic import BaseModel


class StoreResponse(BaseModel):
    id: int
    name: str
    address: str
    city: str
    phone: str | None
    email: str | None
    latitude: Decimal | None
    longitude: Decimal | None
    opening_hours: str | None

    class Config:
        from_attributes = True

