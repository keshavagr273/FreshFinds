<p align="center">
  <img src="docs/assets/logo.png" alt="FreshFinds Logo" width="130" style="border-radius: 28px; box-shadow: 0 16px 36px rgba(0,0,0,0.5);" />
  <h1 align="center">FreshFinds</h1>
  <p align="center">
    <strong>Production-Grade AI-Powered Fresh Food Marketplace & Waste Mitigation Platform</strong><br/>
    <em>Deep Learning Produce Freshness Grading, Real-Time Merchant Inventory & Stock Feeds, Dynamic Pricing Automation, and Socket.IO Order Lifecycles.</em>
  </p>
  <p align="center">
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-22c55e.svg" alt="MIT License"></a>
    <img src="https://img.shields.io/badge/Frontend-React_19_%2B_Vite_7-61DAFB?logo=react&logoColor=black" alt="React 19 + Vite 7">
    <img src="https://img.shields.io/badge/Backend-Node.js_%2B_Express-339933?logo=node.js&logoColor=white" alt="Node.js + Express">
    <img src="https://img.shields.io/badge/Styling-Tailwind_CSS_4-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
    <img src="https://img.shields.io/badge/Database-MongoDB_Atlas-47A248?logo=mongodb&logoColor=white" alt="MongoDB Atlas">
    <img src="https://img.shields.io/badge/AI_Engine-Gradio_%2B_TensorFlow-FF7C00?logo=huggingface&logoColor=white" alt="Hugging Face Gradio">
    <img src="https://img.shields.io/badge/Realtime-Socket.IO_4.7-010101?logo=socket.io&logoColor=white" alt="Socket.IO">
    <img src="https://img.shields.io/badge/Payments-Stripe_Checkout-635BFF?logo=stripe&logoColor=white" alt="Stripe">
    <img src="https://img.shields.io/badge/Media-Cloudinary_CDN-3448C5?logo=cloudinary&logoColor=white" alt="Cloudinary">
  </p>
  <p align="center">
    <a href="#-what-is-freshfinds">About</a> · 
    <a href="#-the-problem">The Problem</a> · 
    <a href="#-features">Features</a> · 
    <a href="#-architecture">Architecture</a> · 
    <a href="#-ml-inference-pipeline">ML Pipeline</a> · 
    <a href="#-feature-comparison">Comparison</a> · 
    <a href="#-quick-start">Quick Start</a> · 
    <a href="#-configuration-reference">Configuration</a> · 
    <a href="#-api-documentation">API Docs</a> · 
    <a href="#-project-structure">Structure</a>
  </p>
</p>

---

## What is FreshFinds?

**FreshFinds** is a production-grade, hyper-local e-commerce marketplace designed to tackle global food waste at the retail and consumer level. It connects local produce vendors, grocery stores, and farmers with neighborhood buyers to redistribute unsold, near-expiry, or surplus produce at dynamically discounted prices.

Unlike traditional grocery apps that treat produce as static SKUs, FreshFinds integrates **Deep Learning Computer Vision** to inspect and grade produce in real-time. By analyzing physical images of fruits and vegetables using a hybrid feature extraction and neural network pipeline hosted on Hugging Face Spaces, FreshFinds quantifies produce freshness, calculates estimated shelf life, and automatically recalibrates discount brackets.

FreshFinds establishes a transparent, high-trust ecosystem:

- **AI-Verified Freshness Scores** — Computer vision classifies produce quality into verifiable tiers (`Very Fresh`, `Fresh`, `Good`, `Fair`, `Poor`, `Spoiled`) with confidence distributions and shelf-life estimates.
- **Dynamic Surplus Pricing** — Automatically incentivizes rapid purchasing of declining stock, turning total merchant write-offs into recovered revenue while giving families access to affordable fresh food.
- **Dual-Persona Marketplace** — Dedicated, role-based workflows for **Customers** (smart browsing, cart management, scheduled delivery slots, order tracking) and **Merchants** (catalog management, automated quality audits, low-stock alerts, sales analytics).
- **Event-Driven Architecture** — Real-time inventory synchronization and order lifecycle dispatching powered by **Socket.IO** rooms.
- **Enterprise-Ready Stack** — Robust multi-layer architecture built with React 19, Vite, Express, MongoDB Atlas, Cloudinary media handling, Stripe payment checkout, and secure JWT authentication.

---

## The Problem

Every year, over **1.3 billion tons** of edible food is discarded globally, with retail produce suffering the steepest losses due to cosmetic degradation, overstocking, and rigid expiration buffers. Meanwhile, consumers struggle with rising food costs and have zero certainty when purchasing discounted produce online.

| Operational Challenge | Traditional Supermarket / Generic Delivery | With FreshFinds |
|---|---|---|
| **Produce Quality Verification** | Subjective claims or hidden blemishes behind packaging | **AI Computer Vision Scoring** with GLCM texture and color histogram classification |
| **Near-Expiry Inventory** | 100% loss through end-of-day dumpster disposal | **Automated Dynamic Discounting** recovering 40–70% of inventory value |
| **Stock Synchronization** | Outdated listings leading to checkout cancellations | **Socket.IO Real-Time Feeds** broadcasting live inventory and order state changes |
| **Shelf-Life Predictability** | Guesswork based on broad calendar expiration dates | **Granular Shelf-Life Estimation** (hours/days) with optimal storage recommendations |
| **Merchant Operational Overhead** | Manual price markdowns with stickers and physical sorting | **One-Click Freshness Auditing** directly updating catalog pricing and visibility |
| **Consumer Affordability** | Full retail markup or low-quality blind "mystery boxes" | **Transparent Quality-to-Price Ratio** with verifiable AI inspection receipts |

---

## Features

### 1. Hybrid AI Freshness & Shelf-Life Inference Engine
- Powered by a custom hybrid deep learning pipeline deployed on **Hugging Face Spaces (`keshav273/freshfinds-dl`)** using **Gradio 6**.
- Combines classical computer vision feature extractors (**Color Histograms, HSV/LAB channels, GLCM Haralick Textures, Local Binary Patterns, and Canny Edge Distributions**) with a TensorFlow hybrid model (`modelo_hibrido_final.h5`).
- Produces normalized 0–100 freshness scores, categorical quality status, top confidence percentages, estimated remaining shelf life (days & hours), and actionable storage guidance.

### 2. Dual-Role Authentication & Access Control
- Isolated registration and login flows for **Customers** and **Merchants** with cryptographically secure **bcryptjs (12 salt rounds)** password hashing.
- Stateless, tamper-proof **JWT (JSON Web Tokens)** containing role claims and scoped resource access.
- Strict middleware enforcement (`auth.js`, `requireRole`) safeguarding merchant catalog actions and customer order records.

### 3. Real-Time WebSocket Order Tracking & Stock Sync
- Bidirectional event messaging powered by **Socket.IO 4.7**.
- Dedicated room partitioning: Customers join `customer_{id}` for instant order status transitions (`pending` $\rightarrow$ `confirmed` $\rightarrow$ `shipped` $\rightarrow$ `delivered`); Merchants join `merchant_{id}` for instant order intake alerts.
- Live inventory alerts warn merchants when produce quantities hit critical low-stock thresholds.

### 4. Dynamic Freshness-Driven Pricing & Waste Mitigation
- Dynamic pricing algorithms compute immediate consumer discounts based on AI freshness degradation curves.
- Automated catalog status toggles: items falling into `poor` or `spoiled` states are quarantined to prevent substandard deliveries.
- Complete historical audit trail: every product tracks its historical freshness scans over time to observe degradation trajectories.

### 5. Frictionless Shopping Cart & Checkout
- Persistent shopping cart backed by MongoDB with quantity constraints, stock validation, and item subtotal caching.
- Checkout flow supporting multiple fulfillment modes (morning/afternoon/evening delivery slots, special delivery instructions, and pickup).
- Secure credit card processing via **Stripe Checkout** and cash-on-delivery fallback.

### 6. Cloudinary CDN Media Pipeline & Multi-File Uploads
- High-throughput image processing leveraging **Multer** for local disk buffering and **Cloudinary** for cloud transformations, optimization, and edge caching.
- Enforces strict MIME-type sniffing (JPG, JPEG, PNG, WebP) and 5MB payload limits with automatic memory cleanup.

### 7. Merchant Control Center & Visual Analytics
- Responsive merchant dashboard built with **Chart.js** and **React-ChartJS-2**.
- Visualizes 30-day revenue trends, daily sales volumes, order status breakdowns, low-stock alerts, and active produce listings.
- Direct inline inventory controls: update pricing, adjust available kilograms/units, or trigger an instant AI re-analysis.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       FreshFinds Web Client (React 19 + Vite 7)             │
│    Marketplace · Freshness Analyzer · Merchant Portal · Cart · Order Hub   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTP REST / Form-Data / WebSocket
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                    FreshFinds Core API Server (Express.js)                   │
│   Rate Limiter · Helmet · CORS · Auth Middleware · Multer · Socket.IO Server │
└──────────────┬───────────────────────┬───────────────────────┬──────────────┘
               │                       │                       │
       Mongoose│            HuggingFace│ Gradio Client         │ Cloudinary / Stripe
┌──────────────▼─────────────┐ ┌───────▼────────────────┐ ┌────▼──────────────┐
│    MongoDB Atlas Cluster   │ │ Hugging Face Spaces DL │ │ External Services │
│  - Users (Roles/Profiles)  │ │ (keshav273/freshfinds) │ │ - Cloudinary CDN  │
│  - Products & Inventory    │ │ - OpenCV Feature Extr. │ │ - Stripe Checkout │
│  - Carts & Active Sessions │ │ - Hybrid TensorFlow .h5│ │ - Nodemailer SMTP │
│  - Orders & Delivery Slots │ │ - Freshness / ShelfLife│ │ - Render / Vercel │
│  - Freshness Analyses Logs │ └────────────────────────┘ └───────────────────┘
└────────────────────────────┘
```

---

## ML Inference Pipeline

```
┌──────────┐    ┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌─────────────┐
│ Produce  │    │ Express API │    │ Gradio Client│    │  OpenCV     │    │  Feature    │
│ Photo    ├───►│ Multer Disc ├───►│ HF Spaces    ├───►│  Color/HSV  ├───►│  Fusion     │
│ Captured │    │ Validation  │    │ Connection   │    │  GLCM / LBP │    │  Extraction │
└──────────┘    └─────────────┘    └──────────────┘    └─────────────┘    └──────┬──────┘
                                                                                 │
┌──────────┐    ┌─────────────┐    ┌──────────────┐    ┌─────────────┐           │
│ Catalog  │    │ Dynamic     │    │ Freshness    │    │ Hybrid CNN  │           │
│ Pricing  │◄───┤ Discount    │◄───┤ Score & Days │◄───┤ Model (.h5) │◄──────────┘
│ Adjusted │    │ Bracket     │    │ Shelf-Life   │    │ Inference   │
└──────────┘    └─────────────┘    └──────────────┘    └─────────────┘
```

---

## Feature Comparison

| Capability | FreshFinds | Traditional Supermarket Apps | Surplus Grab-Bag Apps | Generic Classifieds |
|---|:---:|:---:|:---:|:---:|
| **AI Computer Vision Freshness Grading** | ✅ **Automated (Gradio/TF)** | ❌ | ❌ | ❌ |
| **Quantified Shelf-Life Prediction** | ✅ **Days & Hours Output** | ❌ | ❌ | ❌ |
| **Transparent Single-Item Selection** | ✅ **Choose Exact Produce** | ✅ | ❌ Mystery Surprise Bag | ⚠️ Unstructured |
| **Automated Freshness-Based Discounts** | ✅ **Dynamic Scoring** | ⚠️ Fixed Markdown | ⚠️ Flat Promo Price | ❌ Manual Haggling |
| **Real-Time WebSockets (Socket.IO)** | ✅ **Live Order Tracking** | ⚠️ Polling / Webhooks | ❌ Basic Push | ❌ None |
| **Merchant Storefront & Inventory Portal** | ✅ **Built-in Analytics** | ⚠️ Complex ERP | ⚠️ Restricted Partner App| ❌ None |
| **Secure Payment Processing** | ✅ **Stripe Checkout** | ✅ Proprietary Gateways | ✅ Integrated | ❌ Cash Only |
| **Community Food Waste Mitigation** | ✅ **Core Mission** | ❌ Incidental | ✅ Core Mission | ❌ Incidental |

---

## Quick Start

### Prerequisites
- **[Node.js 20+](https://nodejs.org/)** and `npm` installed
- **[MongoDB](https://www.mongodb.com/try/download/community)** running locally on port `27017` or a free **MongoDB Atlas** connection URI
- **Git** installed

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/keshavagr273/FreshFinds.git
cd FreshFinds
```

---

### Step 2: Configure Environment Variables

#### Backend Configuration
Copy the example file and configure your backend secrets:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/freshmart
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173

# AI Freshness Service (Hugging Face Spaces)
FRESHNESS_SPACE_ID=keshav273/freshfinds-dl
FRESHNESS_PREDICT_API_NAME=/predict_gradio

# Optional: Cloudinary & Stripe (mock fallbacks work for local testing)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=sk_test_your_stripe_key
```

#### Frontend Configuration
```bash
cd ../frontend
```

Create or edit `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_SOCKET_ORIGIN=http://localhost:3000
```

---

### Step 3: Install Dependencies & Seed Sample Data

Open a terminal in the root or `backend/` directory:

```bash
# 1. Install backend dependencies and seed database
cd backend
npm install
npm run seed
```

The database seeder automatically creates:
- 👤 **Sample Customer**: `john@example.com` / `password123`
- 🏪 **Sample Merchant**: `store@freshmart.com` / `password123`
- 🍎 **Sample Inventory**: Organic Bananas, Apples, Spinach, Tomatoes, Fresh Milk with pre-calculated freshness grades.

```bash
# 2. Install frontend dependencies
cd ../frontend
npm install
```

---

### Step 4: Run Development Servers

Run backend and frontend concurrently in separate terminal windows:

```bash
# Terminal 1: Backend Express & Socket.IO Server (Port 3000)
cd backend
npm run dev

# Terminal 2: Frontend Vite React Server (Port 5173)
cd frontend
npm run dev
```

### Access Your Applications:
- 🌐 **Customer & Merchant Web App**: [http://localhost:5173](http://localhost:5173)
- ⚙️ **Backend REST API**: [http://localhost:3000/api](http://localhost:3000/api)
- 🩺 **Health Check**: [http://localhost:3000/api/health](http://localhost:3000/api/health)
- 🤖 **AI Freshness Space**: [https://huggingface.co/spaces/keshav273/freshfinds-dl](https://huggingface.co/spaces/keshav273/freshfinds-dl)

---

## Configuration Reference

### Backend Configuration (`backend/.env`)

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | Express REST API server port |
| `NODE_ENV` | `development` | Runtime environment (`development`, `production`) |
| `MONGODB_URI` | `mongodb://localhost:27017/freshmart` | MongoDB connection URI (Local or Atlas) |
| `JWT_SECRET` | *(required)* | Cryptographic secret for signing JWT tokens |
| `JWT_EXPIRE` | `7d` | Lifetime of signed JWT tokens |
| `FRONTEND_URL` | `http://localhost:5173` | Client origin allowed for WebSockets & CORS |
| `ALLOWED_ORIGINS` | *(comma-separated)* | Whitelisted domains for cross-origin requests |
| `FRESHNESS_SPACE_ID` | `keshav273/freshfinds-dl` | Hugging Face Space ID for AI inference |
| `FRESHNESS_PREDICT_API_NAME` | `/predict_gradio` | Gradio API function route name |
| `HUGGINGFACE_TOKEN` | *(optional)* | Hugging Face user access token (for private spaces) |
| `CLOUDINARY_CLOUD_NAME` | *(optional)* | Cloudinary cloud identifier for media CDN |
| `CLOUDINARY_API_KEY` | *(optional)* | Cloudinary API access key |
| `CLOUDINARY_API_SECRET` | *(optional)* | Cloudinary API access secret |
| `STRIPE_SECRET_KEY` | *(optional)* | Secret key for Stripe payment gateway |
| `STRIPE_PUBLISHABLE_KEY` | *(optional)* | Publishable key for Stripe client-side checkout |
| `EMAIL_USER` / `EMAIL_PASS` | *(optional)* | SMTP credentials for Nodemailer notifications |

### Frontend Configuration (`frontend/.env`)

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:3000/api` | Backend API base URL for Axios calls |
| `VITE_SOCKET_ORIGIN` | `http://localhost:3000` | Socket.IO server connection endpoint |

---

## API Documentation

All API responses strictly adhere to the unified envelope:
```json
{
  "success": true,
  "message": "Descriptive message",
  "data": {},
  "errors": []
}
```

### 🔐 Authentication & Roles
- `POST /api/auth/customer-signup` — Register a new consumer account
- `POST /api/auth/merchant-signup` — Register a new merchant vendor account (with store profile)
- `POST /api/auth/customer-login` — Authenticate customer and receive JWT
- `POST /api/auth/merchant-login` — Authenticate merchant and receive JWT
- `POST /api/auth/logout` — Invalidate user session

### 🍎 Products & Inventory
- `GET    /api/products` — Paginated list of active produce items (with filters & sorting)
- `GET    /api/products/search?q=:query` — Multi-attribute text search across catalog
- `GET    /api/products/category/:category` — Filter items by category (`fruits`, `vegetables`, `organic`)
- `GET    /api/products/:id` — Retrieve comprehensive product detail, images, and reviews
- `POST   /api/products` — Create new produce listing with images *(Merchant Only)*
- `PUT    /api/products/:id` — Update listing details, price, or stock *(Merchant Only)*
- `DELETE /api/products/:id` — Soft-delete / deactivate product listing *(Merchant Only)*

### 🛒 Shopping Cart
- `GET    /api/cart` — Fetch authenticated customer's active cart
- `POST   /api/cart/add` — Add produce item with quantity validation
- `PUT    /api/cart/update` — Adjust item quantity in cart
- `DELETE /api/cart/remove/:productId` — Remove specific item from cart
- `DELETE /api/cart/clear` — Reset and empty cart

### 📦 Orders & Real-Time Fulfillment
- `GET    /api/orders/my-orders` — Customer order history and delivery statuses
- `POST   /api/orders/create` — Place new order with delivery slot and address
- `GET    /api/orders/:id` — Detailed order receipt with line items and tracking
- `POST   /api/orders/:id/cancel` — Cancel pending order
- `POST   /api/orders/:id/rate` — Submit product rating and feedback
- `GET    /api/orders/merchant/orders` — Incoming orders queue *(Merchant Only)*
- `PUT    /api/orders/:id/status` — Advance order state & emit Socket.IO event *(Merchant Only)*

### 🔬 AI Freshness Analysis
- `POST   /api/freshness/analyze` — Run AI freshness classification on an uploaded produce photo
- `POST   /api/freshness/product/:productId/analyze` — Audit product quality & recalculate shelf life *(Merchant Only)*
- `GET    /api/freshness/analysis/:id` — Retrieve stored AI analysis report by ID
- `GET    /api/freshness/history/:productId` — Retrieve longitudinal freshness scans for a product

### 📊 Merchant Operations & Analytics
- `GET    /api/merchant/dashboard` — Overview of revenue, pending orders, and total items
- `GET    /api/merchant/products` — Full inventory catalog with stock levels
- `GET    /api/merchant/analytics?period=30` — Revenue and sales velocity metrics
- `GET    /api/merchant/inventory/low-stock` — Products beneath safety stock thresholds

---

## Project Structure

```text
FreshFinds/
├── backend/
│   ├── controllers/             # Business logic & request orchestrators
│   │   ├── authController.js    # JWT issuance & role validation
│   │   ├── cartController.js    # Session-persistent cart operations
│   │   ├── dashboardController.js # Analytics calculation
│   │   ├── freshnessController.js # Gradio HF AI client & score parsing
│   │   ├── merchantController.js # Vendor catalog & sales metrics
│   │   ├── orderController.js   # Order state machine & Socket.IO dispatch
│   │   ├── productController.js # Produce CRUD & inventory updates
│   │   └── userController.js    # Profile & avatar management
│   ├── middleware/              # Express middlewares
│   │   ├── auth.js              # JWT verification & role gates
│   │   └── upload.js            # Multer disk buffering & validation
│   ├── models/                  # Mongoose ODM schemas
│   │   ├── Cart.js              # Shopping cart & subtotal schema
│   │   ├── FreshnessAnalysis.js # AI classification receipts & metrics
│   │   ├── Order.js             # Order items, delivery slot, tracking
│   │   ├── Product.js           # Produce SKU, stock, and freshness scores
│   │   └── User.js              # Customer & Merchant user records
│   ├── routes/                  # Express REST route endpoints
│   ├── uploads/                 # Temporary local image staging buffer
│   ├── seedData.js              # Development seeder for demo accounts & SKUs
│   ├── server.js                # Express app setup, Socket.IO rooms, Mongo connection
│   ├── .env.example             # Backend environment template
│   └── package.json             # Backend dependencies & scripts
├── frontend/
│   ├── public/                  # Static assets (Logos, favicons)
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Cart.jsx         # Slide-out interactive shopping cart
│   │   │   ├── CustomerLogIn.jsx # Role-based authentication modal
│   │   │   ├── CustomerSignUp.jsx # Registration form with role picker
│   │   │   ├── FreshnessAnalyzer.jsx # Produce photo dropzone & AI score viewer
│   │   │   ├── Header.jsx       # Global responsive navigation header
│   │   │   └── Navbar.jsx       # Category sub-navigation bar
│   │   ├── pages/               # Top-level view modules
│   │   │   ├── Account.jsx      # Customer profile & order history
│   │   │   ├── HomePage.jsx     # Hero landing page & mission banner
│   │   │   ├── MerchantAddProduct.jsx # Produce listing creator
│   │   │   ├── MerchantMyProducts.jsx # Merchant stock & audit manager
│   │   │   ├── ProductDashboard.jsx   # Produce detail, quality score, & reviews
│   │   │   ├── ShopDashboard.jsx      # Marketplace catalog & search filters
│   │   │   └── ShopDashboardOverview.jsx # Merchant Chart.js analytics
│   │   ├── App.jsx              # Main routing & application state wrapper
│   │   ├── index.css            # Tailwind CSS 4 directives & custom themes
│   │   └── main.jsx             # React 19 DOM bootstrap
│   ├── .env                     # Frontend environment config
│   ├── vite.config.js           # Vite 7 build configuration
│   └── package.json             # Frontend dependencies & scripts
├── docs/                        # Architecture diagrams & media assets
│   └── assets/
│       └── logo.png             # Official FreshFinds logo
├── LICENSE                      # MIT Open Source License
└── README.md                    # Project Documentation
```

---

## Contributing

We welcome contributions from developers, designers, and sustainability advocates!

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feat/dynamic-expiry-notifications`)
3. **Commit** your changes (`git commit -m 'feat: add automated SMS alert for near-expiry produce'`)
4. **Push** to the branch (`git push origin feat/dynamic-expiry-notifications`)
5. **Open** a Pull Request

Please ensure your changes are linted, test-covered, and accompanied by relevant documentation.

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <strong>FreshFinds</strong><br/>
  <em>Empowering Local Communities with AI-Driven Produce Quality & Zero-Waste Food Systems.</em>
</p>
