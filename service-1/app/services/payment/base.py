from abc import ABC, abstractmethod
from decimal import Decimal


class PaymentProvider(ABC):
    @abstractmethod
    async def create_payment_url(
        self,
        amount: Decimal,
        order_id: str,
        order_info: str,
        return_url: str,
        ip_addr: str,
    ) -> str:
        pass

    @abstractmethod
    async def verify_payment_callback(self, data: dict) -> dict:
        pass

