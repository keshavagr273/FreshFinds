# FreshMart Backend

A comprehensive backend API for the FreshMart e-commerce platform, built with Node.js, Express, and MongoDB.

## Features

- **Authentication & Authorization**
  - Customer and Merchant registration/login
  - JWT-based authentication
  - Role-based access control

- **Product Management**
  - CRUD operations for products
  - Image upload and management
  - Stock management
  - Product ratings and reviews
  - Category-based filtering

- **Shopping Cart**
  - Add/remove items
  - Update quantities
  - Persistent cart storage

- **Order Management**
  - Order creation and tracking
  - Status updates
  - Order history

- **Freshness Analysis**
  - AI-powered freshness detection
  - Product quality scoring
  - Shelf-life estimation

- **Dashboard Analytics**
  - Customer dashboard with order history
  - Merchant dashboard with sales analytics
  - Real-time notifications

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start MongoDB service

5. Run the application
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/customer-signup` - Customer registration
- `POST /api/auth/merchant-signup` - Merchant registration
- `POST /api/auth/customer-login` - Customer login
- `POST /api/auth/merchant-login` - Merchant login
- `POST /api/auth/logout` - Logout

### Products
- `GET /api/products` - Get all products
- `GET /api/products/search` - Search products
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Merchant)
- `PUT /api/products/:id` - Update product (Merchant)
- `DELETE /api/products/:id` - Delete product (Merchant)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove/:productId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart

### Orders
- `GET /api/orders/my-orders` - Get customer orders
- `POST /api/orders/create` - Create order
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/merchant/orders` - Get merchant orders
- `PUT /api/orders/:id/status` - Update order status (Merchant)

### Freshness Analysis
- `POST /api/freshness/analyze` - Analyze image freshness
- `POST /api/freshness/product/:productId/analyze` - Analyze product image (Merchant)
- `GET /api/freshness/history/:productId` - Get freshness history

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/avatar` - Upload avatar
- `PUT /api/users/password` - Change password

### Merchant Dashboard
- `GET /api/merchant/dashboard` - Get dashboard overview
- `GET /api/merchant/products` - Get merchant products
- `GET /api/merchant/orders` - Get merchant orders
- `GET /api/merchant/analytics` - Get analytics data

## Environment Variables

```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/freshmart
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
```

## Project Structure

```
backend/
├── controllers/          # Request handlers
├── middleware/          # Custom middleware
├── models/             # Database models
├── routes/             # API routes
├── uploads/            # File upload directory
├── server.js           # Application entry point
├── package.json        # Dependencies and scripts
└── README.md          # Documentation
```

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Multer** - File upload handling
- **Socket.IO** - Real-time communication
- **bcryptjs** - Password hashing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.