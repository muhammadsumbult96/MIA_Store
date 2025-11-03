# API Documentation

## Base URL

- Development: `http://localhost:8000/api/v1`
- Production: `https://api.mia-commerce.com/api/v1`

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Endpoints

### Authentication

#### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "full_name": "John Doe"
}
```

**Response:**
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer"
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

#### Refresh Token

```http
POST /auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJ..."
}
```

### Products

#### Get Products

```http
GET /products?page=1&page_size=20&category_id=1&search=laptop&min_price=1000000&max_price=5000000
```

**Query Parameters:**
- `page` (integer): Page number (default: 1)
- `page_size` (integer): Items per page (default: 20, max: 100)
- `category_id` (integer, optional): Filter by category
- `search` (string, optional): Search term
- `min_price` (float, optional): Minimum price
- `max_price` (float, optional): Maximum price

**Response:**
```json
{
  "items": [
    {
      "id": 1,
      "name": "Product Name",
      "slug": "product-name",
      "description": "Product description",
      "price": "1000000.00",
      "discounted_price": null,
      "stock_quantity": 50,
      "sku": "PROD-001",
      "category_id": 1,
      "is_active": true,
      "images": []
    }
  ],
  "total": 100,
  "page": 1,
  "page_size": 20,
  "total_pages": 5
}
```

#### Get Product by ID

```http
GET /products/{product_id}
```

#### Get Product by Slug

```http
GET /products/slug/{slug}
```

#### Get Categories

```http
GET /categories
```

### Cart

#### Get Cart

```http
GET /cart
Authorization: Bearer <token>
```

#### Add to Cart

```http
POST /cart/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "product_id": 1,
  "quantity": 2
}
```

#### Update Cart Item

```http
PATCH /cart/items/{item_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3
}
```

#### Remove from Cart

```http
DELETE /cart/items/{item_id}
Authorization: Bearer <token>
```

### Orders

#### Create Order

```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    }
  ],
  "shipping_info": {
    "shipping_name": "John Doe",
    "shipping_phone": "0123456789",
    "shipping_address": "123 Main St",
    "shipping_city": "Ho Chi Minh",
    "shipping_postal_code": "700000"
  },
  "notes": "Please deliver in the morning"
}
```

#### Get Orders

```http
GET /orders?page=1&page_size=20
Authorization: Bearer <token>
```

#### Get Order by ID

```http
GET /orders/{order_id}
Authorization: Bearer <token>
```

#### Get Order by Number

```http
GET /orders/number/{order_number}
Authorization: Bearer <token>
```

### Payments

#### Create Payment

```http
POST /payments/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "order_number": "ORD-ABC123",
  "return_url": "https://mia-commerce.com/payment/callback"
}
```

**Response:**
```json
{
  "payment_url": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?..."
}
```

#### Payment Callback

```http
GET /payments/callback?vnp_Amount=10000000&vnp_BankCode=NCB&...
```

### Wishlist

#### Get Wishlist

```http
GET /wishlist
Authorization: Bearer <token>
```

#### Add to Wishlist

```http
POST /wishlist/items?product_id=1
Authorization: Bearer <token>
```

#### Remove from Wishlist

```http
DELETE /wishlist/items/{item_id}
Authorization: Bearer <token>
```

#### Check Wishlist

```http
GET /wishlist/check/{product_id}
Authorization: Bearer <token>
```

### Reviews

#### Create Review

```http
POST /reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "product_id": 1,
  "rating": 5,
  "title": "Great product!",
  "comment": "Very satisfied with this purchase."
}
```

#### Get Product Reviews

```http
GET /reviews/product/{product_id}?page=1&page_size=10
```

### Stores

#### Get Stores

```http
GET /stores
```

## Error Responses

All errors follow this format:

```json
{
  "detail": "Error message description"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

API rate limits:
- Unauthenticated: 60 requests per minute
- Authenticated: 120 requests per minute
