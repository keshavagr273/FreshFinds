#!/bin/bash

echo "🚀 Starting FreshMart Backend Setup..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ to continue."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep mongod > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB service first."
    echo "   Windows: net start MongoDB"
    echo "   macOS/Linux: sudo systemctl start mongod"
    read -p "Press Enter after starting MongoDB..."
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📋 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your configuration."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create uploads directory
if [ ! -d "uploads" ]; then
    echo "📁 Creating uploads directory..."
    mkdir uploads
fi

# Seed database
echo "🌱 Seeding database with sample data..."
npm run seed

echo "✅ Setup complete!"
echo ""
echo "🎉 Your FreshMart backend is ready!"
echo ""
echo "To start the server:"
echo "  npm run dev    (development with auto-reload)"
echo "  npm start      (production)"
echo ""
echo "API will be available at: http://localhost:3000"
echo "Health check: http://localhost:3000/api/health"
echo ""
echo "Sample login credentials:"
echo "Customer: john@example.com / password123"
echo "Merchant: merchant1@freshmart.com / merchant123"