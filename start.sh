#!/bin/bash

echo "🚀 Starting ChatParalegal Backend..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Please copy env.example to .env and configure it."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if database is running (PostgreSQL)
echo "🔍 Checking database connection..."
if ! pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo "❌ PostgreSQL is not running. Please start PostgreSQL first."
    exit 1
fi

echo "✅ Database is running"

# Run migrations
echo "🗄️  Running database migrations..."
npm run migrate

# Start the server
echo "🌐 Starting server..."
npm run dev 