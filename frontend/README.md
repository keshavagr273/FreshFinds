# FreshMart Frontend

This is the frontend application for FreshMart, built with React and Vite.

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Cart.jsx         # Shopping cart component
│   ├── CustomerLogIn.jsx # Customer login form
│   ├── CustomerSignUp.jsx # Customer signup form
│   ├── FreshnessAnalyzer.jsx # AI freshness analysis component
│   ├── Navbar.jsx       # Navigation bar component
│   └── index.js         # Component exports
├── pages/               # Page-level components
│   ├── ProductDashboard.jsx # Individual product view
│   ├── ShopDashboard.jsx    # Main shopping interface
│   ├── ShopDashboardOverview.jsx # Store overview/analytics
│   └── index.js         # Page exports
├── components_css/      # CSS modules for components
│   └── Signup.module.css # Styles for signup component
├── styles/              # Global styles (placeholder)
├── assets/              # Static assets
│   └── react.svg
├── App.jsx             # Main application component
├── App.css             # Global app styles
├── index.css           # Global CSS
└── main.jsx            # Application entry point
```

## Components Overview

### Components (`/src/components/`)

1. **Cart.jsx** - Shopping cart with quantity management and checkout
2. **CustomerLogIn.jsx** - Login form for customers and merchants
3. **CustomerSignUp.jsx** - Registration form with role selection
4. **FreshnessAnalyzer.jsx** - AI-powered freshness analysis tool
5. **Navbar.jsx** - Navigation bar component

### Pages (`/src/pages/`)

1. **ShopDashboard.jsx** - Main marketplace with product browsing
2. **ProductDashboard.jsx** - Detailed product view with reviews and nutritional info
3. **ShopDashboardOverview.jsx** - Analytics dashboard for store owners

## Features

- **Multi-role Authentication**: Support for both customers and merchants
- **Product Management**: Browse, search, and filter products
- **Shopping Cart**: Add/remove items with quantity management
- **Freshness Analysis**: AI-powered produce freshness detection
- **Responsive Design**: Mobile-first responsive layouts
- **Modern UI**: Clean, modern interface with Tailwind CSS

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Deploying to Vercel

This repository is configured to deploy only the frontend (`FreshFinds/frontend`) to Vercel as a static site built by Vite. The backend (`FreshFinds/backend`) should be deployed to a Node host (e.g., Render, Railway, Fly.io) because it uses local uploads and Socket.IO which are not suitable for Vercel's serverless filesystem.

### Steps

1. Push the repository to GitHub/GitLab/Bitbucket.
2. In Vercel, import the repository. The root `vercel.json` instructs Vercel to build `FreshFinds/frontend`.
3. Vercel will build with:
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Required Environment Variables (Vercel)

Set these for the frontend project in Vercel:

- `VITE_API_BASE_URL`: Your backend API base, e.g. `https://your-backend.example.com/api`

Optional (if you use cross-origin sockets or want links rendered correctly):

- `VITE_SOCKET_ORIGIN`: Origin for Socket.IO server, e.g. `https://your-backend.example.com`

### Backend deployment notes

- The backend writes uploads to a local `uploads/` directory via `multer`. In serverless environments like Vercel, this storage is ephemeral. Use a persistent storage service (e.g., S3, Cloudinary) or deploy to a persistent Node host.
- Configure these environment variables on your backend host:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `ALLOWED_ORIGINS` (comma-separated; include your Vercel domain)
  - `FRONTEND_URL` (your Vercel domain)

### Local development

- Start backend: `cd FreshFinds/backend && npm i && npm run dev`
- Start frontend: `cd FreshFinds/frontend && npm i && npm run dev`
- Set `VITE_API_BASE_URL=http://localhost:3000/api` for the frontend.

## Dependencies

- **React 19**: UI framework
- **Vite**: Build tool and dev server
- **Axios**: HTTP client for API requests
- **React Toastify**: Toast notifications
- **Tailwind CSS**: Utility-first CSS framework (via CDN)

## Issues Fixed

1. ✅ Renamed `.txt` files to proper `.jsx` extensions
2. ✅ Converted HTML templates to React components
3. ✅ Organized files into logical folder structure
4. ✅ Fixed import paths and dependencies
5. ✅ Created missing CSS modules
6. ✅ Added proper component exports
7. ✅ Installed missing npm packages
8. ✅ Added navigation system in main App.jsx

## Usage

The main App.jsx now includes a navigation system that allows you to switch between different views:

- **Shop**: Main product browsing interface
- **Product**: Detailed product view
- **Cart**: Shopping cart management
- **Analyzer**: Freshness analysis tool
- **Overview**: Store analytics dashboard
- **Login/Signup**: Authentication forms

All components are properly organized and can be imported individually as needed.

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
