#!/bin/bash

# YC Empire Booking System - Deployment Script

echo "🚀 YC Empire Booking System - Vercel Deployment"
echo "================================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Uncommitted changes detected. Committing..."
    git add .
    read -p "Enter commit message (or press Enter for default): " commit_msg
    if [ -z "$commit_msg" ]; then
        commit_msg="Deploy: Updated booking system for Vercel with Resend integration"
    fi
    git commit -m "$commit_msg"
else
    echo "✅ No uncommitted changes"
fi

# Push to remote
echo "📤 Pushing to remote repository..."
git push origin main

# Navigate to bookings app
cd apps/bookings

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🔧 Next steps:"
echo "1. Set up environment variables in Vercel dashboard"
echo "2. Configure Resend-Vercel integration"
echo "3. Test the deployed application"
echo ""
echo "📖 For detailed instructions, see: apps/bookings/DEPLOYMENT.md"
