# API Reference Manual: Krushisarthi

This reference catalog specifies the HTTP endpoints, payload structures, authentication criteria, and sample responses exposed by the Krushisarthi backend server.

---

## 1. Authentication

The administration endpoints require JWT authentication.
* **Header:** `Authorization: Bearer <your_jwt_token>`
* Token lifetimes are restricted to 24 hours.

---

## 2. Order Management API

### 2.1. Place Order
* **Endpoint:** `POST /api/orders`
* **Access:** Public
* **Payload Structure:**
```json
{
  "name": "Arjun Patil",
  "email": "arjun.patil@example.com",
  "mobile": "9876543210",
  "address": "12, Shivaji Chowk",
  "city": "Kolhapur",
  "state": "Maharashtra",
  "pincode": "416001",
  "deliveryZone": "state",
  "items": [
    {
      "id": "cube",
      "name": "Jaggery Cube",
      "price": 249,
      "quantity": 1.5
    }
  ],
  "subtotal": 373.5,
  "gst": 18.68,
  "deliveryFee": 100,
  "discount": 0,
  "total": 492.18,
  "couponCode": "",
  "paymentMethod": "upi"
}
```
* **Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "orderId": "KS-0024",
  "order": {
    "_id": "603f29b4fb9b2c34c8d4512a",
    "orderId": "KS-0024",
    "customer": {
      "name": "Arjun Patil",
      "email": "arjun.patil@example.com",
      "mobile": "9876543210"
    },
    "shipping": {
      "address": "12, Shivaji Chowk",
      "city": "Kolhapur",
      "state": "Maharashtra",
      "pincode": "416001",
      "deliveryZone": "state"
    },
    "items": [
      {
        "id": "cube",
        "name": "Jaggery Cube",
        "price": 249,
        "quantity": 1.5
      }
    ],
    "financials": {
      "subtotal": 373.5,
      "gst": 18.68,
      "deliveryFee": 100,
      "discount": 0,
      "total": 492.18
    },
    "paymentMethod": "upi",
    "paymentStatus": "pending",
    "status": "received",
    "createdAt": "2026-06-19T07:22:15.123Z",
    "updatedAt": "2026-06-19T07:22:15.123Z"
  }
}
```

### 2.2. Get All Orders
* **Endpoint:** `GET /api/orders`
* **Access:** Private (Admin JWT Required)
* **Success Response (200 OK):**
```json
{
  "success": true,
  "count": 1,
  "orders": [
    {
      "orderId": "KS-0024",
      "customer": { "name": "Arjun Patil" },
      "status": "received",
      "paymentStatus": "pending"
    }
  ]
}
```

### 2.3. Get Order Details
* **Endpoint:** `GET /api/orders/:orderId`
* **Access:** Public
* **Success Response (200 OK):**
```json
{
  "success": true,
  "order": {
    "orderId": "KS-0024",
    "customer": { "name": "Arjun Patil", "email": "arjun.patil@example.com" },
    "shipping": { "city": "Kolhapur" },
    "financials": { "total": 492.18 },
    "paymentStatus": "pending",
    "status": "received"
  }
}
```

### 2.4. Bulk Update Order Status
* **Endpoint:** `PATCH /api/orders/status`
* **Access:** Private (Admin JWT Required)
* **Payload Structure:**
```json
{
  "orderIds": ["KS-0024", "KS-0025"],
  "status": "shipped"
}
```
* **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Successfully updated 2 orders to 'shipped'.",
  "modifiedCount": 2
}
```

### 2.5. Bulk Delete Orders
* **Endpoint:** `DELETE /api/orders`
* **Access:** Private (Admin JWT Required)
* **Payload Structure:**
```json
{
  "orderIds": ["KS-0024", "KS-0025"]
}
```
* **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Successfully deleted 2 orders.",
  "deletedCount": 2
}
```

---

## 3. Payments API

### 3.1. Create Razorpay Transaction
* **Endpoint:** `POST /api/payments/order`
* **Access:** Public
* **Payload Structure:**
```json
{
  "orderId": "KS-0024"
}
```
* **Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Razorpay order created successfully.",
  "keyId": "rzp_test_YourKeyId",
  "orderId": "KS-0024",
  "razorpayOrderId": "order_GhjKlPqWxz123",
  "amount": 49218,
  "currency": "INR",
  "order": {
    "orderId": "KS-0024",
    "razorpayOrderId": "order_GhjKlPqWxz123",
    "paymentStatus": "pending"
  }
}
```

### 3.2. Verify Payment Signature
* **Endpoint:** `POST /api/payments/verify`
* **Access:** Public
* **Payload Structure:**
```json
{
  "orderId": "KS-0024",
  "razorpay_order_id": "order_GhjKlPqWxz123",
  "razorpay_payment_id": "pay_PlmKnb1290zx",
  "razorpay_signature": "e5816da324c...b98c"
}
```
* **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Payment verified successfully.",
  "paymentStatus": "paid",
  "order": {
    "orderId": "KS-0024",
    "paymentStatus": "paid"
  }
}
```

---

## 4. Administration API

### 4.1. Admin Login
* **Endpoint:** `POST /api/admin/login`
* **Access:** Public (With strict rate limit: max 30 attempts per 15 minutes)
* **Payload Structure:**
```json
{
  "email": "admin1@krushisarthi.com",
  "password": "your_secure_password"
}
```
* **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "name": "Admin 1",
    "email": "admin1@krushisarthi.com"
  }
}
```

### 4.2. Verify Token
* **Endpoint:** `GET /api/admin/verify`
* **Access:** Private (Admin JWT Required)
* **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Token is valid.",
  "admin": {
    "email": "admin1@krushisarthi.com",
    "role": "admin",
    "name": "Admin 1"
  }
}
```

---

## 5. System Health & Interactivity

### 5.1. Database Ping (Latency Indicator)
* **Endpoint:** `GET /api/db-ping`
* **Access:** Public
* **Success Response (200 OK):**
```json
{
  "success": true,
  "latencyMs": 14
}
```

### 5.2. Health Check Telemetry
* **Endpoint:** `GET /api/health`
* **Access:** Public
* **Success Response (200 OK):**
```json
{
  "status": "UP",
  "timestamp": "2026-06-19T07:22:15.123Z",
  "env": "development",
  "uptime": {
    "raw": 3456.78,
    "formatted": "57m 36s"
  },
  "database": {
    "status": "Connected",
    "host": "krushisarthi-shard-00.mongodb.net",
    "name": "krushisarthi"
  },
  "system": {
    "nodeVersion": "v18.12.1",
    "platform": "win32",
    "cpuCount": 8,
    "memory": {
      "processHeapUsed": "48.2 MB",
      "systemFree": "4.12 GB",
      "systemTotal": "16.0 GB",
      "systemUsagePercentage": "74.2%"
    }
  }
}
```
### 5.3. Visual Admin Status Dashboard
* **Endpoint:** `GET /` (Root Endpoint on port 5000)
* **Access:** Public
* **Return Type:** `text/html`
* Renders the real-time server environment metrics, memory gauge meters, and system health status directly to web browsers.
