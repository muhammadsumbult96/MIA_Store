import hmac
import hashlib
from urllib.parse import urlencode, quote_plus
from decimal import Decimal
from datetime import datetime

from app.core.config import settings
from app.services.payment.base import PaymentProvider


class VNPayProvider(PaymentProvider):
    def __init__(self):
        self.tmn_code = getattr(settings, "VNPAY_TMN_CODE", "")
        self.secret_key = getattr(settings, "VNPAY_SECRET_KEY", "")
        self.url = getattr(settings, "VNPAY_URL", "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html")
        self.return_url = getattr(settings, "VNPAY_RETURN_URL", "http://localhost:3000/payment/callback")

    def _make_signature(self, data: dict) -> str:
        query_string = urlencode(sorted(data.items()))
        hmac_sha512 = hmac.new(
            self.secret_key.encode("utf-8"),
            query_string.encode("utf-8"),
            hashlib.sha512,
        )
        return hmac_sha512.hexdigest()

    def _verify_signature(self, data: dict, signature: str) -> bool:
        vnp_params = {k: v for k, v in data.items() if k.startswith("vnp_") and k != "vnp_SecureHash"}
        query_string = urlencode(sorted(vnp_params.items()))
        hmac_sha512 = hmac.new(
            self.secret_key.encode("utf-8"),
            query_string.encode("utf-8"),
            hashlib.sha512,
        )
        return hmac_sha512.hexdigest() == signature

    async def create_payment_url(
        self,
        amount: Decimal,
        order_id: str,
        order_info: str,
        return_url: str,
        ip_addr: str,
    ) -> str:
        vnp_params = {
            "vnp_Version": "2.1.0",
            "vnp_Command": "pay",
            "vnp_TmnCode": self.tmn_code,
            "vnp_Amount": str(int(amount * 100)),
            "vnp_CurrCode": "VND",
            "vnp_TxnRef": order_id,
            "vnp_OrderInfo": order_info,
            "vnp_OrderType": "other",
            "vnp_Locale": "vi",
            "vnp_ReturnUrl": return_url,
            "vnp_IpAddr": ip_addr,
            "vnp_CreateDate": datetime.now().strftime("%Y%m%d%H%M%S"),
        }

        vnp_params["vnp_SecureHash"] = self._make_signature(vnp_params)
        
        query_string = urlencode(sorted(vnp_params.items()))
        return f"{self.url}?{query_string}"

    async def verify_payment_callback(self, data: dict) -> dict:
        vnp_secure_hash = data.get("vnp_SecureHash", "")
        
        if not self._verify_signature(data, vnp_secure_hash):
            return {
                "success": False,
                "message": "Invalid signature",
            }

        response_code = data.get("vnp_ResponseCode", "")
        transaction_status = data.get("vnp_TransactionStatus", "")

        if response_code == "00" and transaction_status == "00":
            return {
                "success": True,
                "order_id": data.get("vnp_TxnRef"),
                "transaction_id": data.get("vnp_TransactionNo"),
                "amount": Decimal(data.get("vnp_Amount", "0")) / 100,
                "payment_date": data.get("vnp_PayDate"),
                "message": "Payment successful",
            }
        else:
            return {
                "success": False,
                "order_id": data.get("vnp_TxnRef"),
                "response_code": response_code,
                "message": data.get("vnp_ResponseCode", "Payment failed"),
            }


def get_payment_provider() -> PaymentProvider:
    return VNPayProvider()

