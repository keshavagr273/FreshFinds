# FreshMart API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication

Most endpoints require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Response Format

All API responses follow this format:
```json
{
  "success": true|false,
  "message": "Response message",
  "data": {}, // Response data (if applicable)
  "errors": [] // Validation errors (if applicable)
}
```

---

## Authentication Endpoints

### Customer Signup
```http
POST /auth/customer-signup
```

**Body:**
```json
{
  "username": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890"
}
```

### Merchant Signup
```http
POST /auth/merchant-signup
```

**Body:**
```json
{
  "username": "Store Owner",
  "email": "merchant@example.com",
  "password": "password123",
  "phone": "1234567890",
  "storeName": "My Fresh Store"
}
```

### Customer Login
```http
POST /auth/customer-login
```

**Body:**
```json
{
  "userID": "john@example.com", // or customerID
  "password": "password123"
}
```

### Merchant Login
```http
POST /auth/merchant-login
```

**Body:**
```json
{
  "userID": "merchant@example.com", // or merchantID
  "password": "password123"
}
```

---

## Product Endpoints

### Get All Products
```http
GET /products?page=1&limit=20&sort=-createdAt
```

### Search Products
```http
GET /products/search?q=banana&category=fruits&minPrice=1&maxPrice=10
```

### Get Products by Category
```http
GET /products/category/fruits
```

### Get Product by ID
```http
GET /products/:id
```

### Create Product (Merchant Only)
```http
POST /products
Authorization: Bearer <merchant_token>
Content-Type: multipart/form-data
```

**Form Data:**
```
name: Fresh Bananas
description: Organic bananas from local farms
price: 2.99
category: fruits
stock[quantity]: 50
stock[unit]: kg
images: [file1, file2, ...]
```

### Update Product (Merchant Only)
```http
PUT /products/:id
Authorization: Bearer <merchant_token>
```

### Delete Product (Merchant Only)
```http
DELETE /products/:id
Authorization: Bearer <merchant_token>
```

---

## Cart Endpoints

### Get Cart
```http
GET /cart
Authorization: Bearer <customer_token>
```

### Add to Cart
```http
POST /cart/add
Authorization: Bearer <customer_token>
```

**Body:**
```json
{
  "productId": "product_id_here",
  "quantity": 2
}
```

### Update Cart Item
```http
PUT /cart/update
Authorization: Bearer <customer_token>
```

**Body:**
```json
{
  "productId": "product_id_here",
  "quantity": 3
}
```

### Remove from Cart
```http
DELETE /cart/remove/:productId
Authorization: Bearer <customer_token>
```

### Clear Cart
```http
DELETE /cart/clear
Authorization: Bearer <customer_token>
```

---

## Order Endpoints

### Get Customer Orders
```http
GET /orders/my-orders?page=1&limit=10
Authorization: Bearer <customer_token>
```

### Create Order
```http
POST /orders/create
Authorization: Bearer <customer_token>
```

**Body:**
```json
{
  "shippingAddress": {
    "fullName": "John Doe",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA",
    "phone": "1234567890"
  },
  "paymentMethod": "card",
  "deliverySlot": {
    "date": "2024-10-06T00:00:00.000Z",
    "timeSlot": "morning"
  },
  "deliveryInstructions": "Leave at door"
}
```

### Get Order by ID
```http
GET /orders/:id
Authorization: Bearer <customer_token>
```

### Cancel Order
```http
POST /orders/:id/cancel
Authorization: Bearer <customer_token>
```

### Rate Order
```http
POST /orders/:id/rate
Authorization: Bearer <customer_token>
```

**Body:**
```json
{
  "rating": 5,
  "review": "Great products and fast delivery!"
}
```

---

## Merchant Endpoints

### Get Dashboard
```http
GET /merchant/dashboard
Authorization: Bearer <merchant_token>
```

### Get Merchant Products
```http
GET /merchant/products?page=1&limit=20&status=active
Authorization: Bearer <merchant_token>
```

### Get Merchant Orders
```http
GET /merchant/orders?page=1&limit=20&status=pending
Authorization: Bearer <merchant_token>
```

### Update Order Status
```http
PUT /orders/:id/status
Authorization: Bearer <merchant_token>
```

**Body:**
```json
{
  "status": "shipped",
  "note": "Order dispatched via courier"
}
```

### Get Analytics
```http
GET /merchant/analytics?period=30
Authorization: Bearer <merchant_token>
```

### Get Low Stock Products
```http
GET /merchant/inventory/low-stock?threshold=5
Authorization: Bearer <merchant_token>
```

---

## Freshness Analysis Endpoints

### Analyze Image
```http
POST /freshness/analyze
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
```
image: [image_file]
```

### Analyze Product Image (Merchant Only)
```http
POST /freshness/product/:productId/analyze
Authorization: Bearer <merchant_token>
Content-Type: multipart/form-data
```

**Form Data:**
```
image: [image_file]
```

### Get Analysis by ID
```http
GET /freshness/analysis/:id
Authorization: Bearer <token>
```

### Get Product Freshness History
```http
GET /freshness/history/:productId
```

---

## User Management Endpoints

### Get Profile
```http
GET /users/profile
Authorization: Bearer <token>
```

### Update Profile
```http
PUT /users/profile
Authorization: Bearer <token>
```

**Body:**
```json
{
  "username": "Updated Name",
  "phone": "0987654321",
  "address": {
    "street": "456 New St",
    "city": "Boston",
    "state": "MA",
    "zipCode": "02101",
    "country": "USA"
  }
}
```

### Upload Avatar
```http
POST /users/avatar
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
```
avatar: [image_file]
```

### Change Password
```http
PUT /users/password
Authorization: Bearer <token>
```

**Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

---

## Dashboard Endpoints

### Customer Dashboard
```http
GET /dashboard/customer
Authorization: Bearer <customer_token>
```

---

## Error Codes

- `400` - Bad Request (validation errors, missing data)
- `401` - Unauthorized (invalid or missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

## Rate Limiting

API endpoints are rate-limited to 100 requests per 15 minutes per IP address.

## File Upload Limits

- Maximum file size: 5MB
- Maximum files per request: 5
- Allowed formats: JPG, JPEG, PNG, GIF, WebP