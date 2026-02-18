@echo off
echo 🚀 Starting FreshMart Backend Setup...

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ to continue.
    pause
    exit /b 1
)

:: Check if .env file exists
if not exist .env (
    echo 📋 Creating .env file from template...
    copy .env.example .env
    echo ✅ .env file created. Please update it with your configuration.
)

:: Install dependencies
echo 📦 Installing dependencies...
call npm install

:: Create uploads directory
if not exist uploads (
    echo 📁 Creating uploads directory...
    mkdir uploads
)

:: Seed database
echo 🌱 Seeding database with sample data...
call npm run seed

echo ✅ Setup complete!
echo.
echo 🎉 Your FreshMart backend is ready!
echo.
echo To start the server:
echo   npm run dev    (development with auto-reload)
echo   npm start      (production)
echo.
echo API will be available at: http://localhost:3000
echo Health check: http://localhost:3000/api/health
echo.
echo Sample login credentials:
echo Customer: john@example.com / password123
echo Merchant: merchant1@freshmart.com / merchant123
echo.
pause