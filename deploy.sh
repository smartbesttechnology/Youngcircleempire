#!/bin/bash

echo "🚀 Starting YCEmpire deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build all images
echo "🔨 Building all application images..."
docker-compose build --no-cache

# Start all services
echo "🚀 Starting all services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
echo "🔍 Checking service status..."
docker-compose ps

echo "✅ Deployment completed!"
echo ""
echo "🌐 Your applications are now available at:"
echo "   Main App:     http://ycempire.com (port 3000)"
echo "   Admin App:    http://admin.ycempire.com (port 3001)"
echo "   Bookings App: http://bookings.ycempire.com (port 3002)"
echo "   Rentals App:  http://rentals.ycempire.com (port 3003)"
echo "   Links App:    http://links.ycempire.com (port 3004)"
echo ""
echo "📝 To view logs: docker-compose logs -f [service-name]"
echo "📝 To stop: docker-compose down"
echo "📝 To restart: docker-compose restart" 