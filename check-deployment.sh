#!/bin/bash

# 🚀 Deployment Checklist Script
# This script helps you prepare your project for deployment to Vercel and Render

echo "📋 Portfolio Deployment Checklist"
echo "=================================="
echo ""

# Check Git setup
echo "1️⃣  Checking Git Setup..."
if [ -d .git ]; then
    echo "   ✅ Git repository found"
else
    echo "   ❌ Git repository not found. Run: git init"
    exit 1
fi

# Check Node setup
echo ""
echo "2️⃣  Checking Node.js Setup..."
if command -v node &> /dev/null; then
    echo "   ✅ Node.js installed: $(node -v)"
else
    echo "   ❌ Node.js not installed"
    exit 1
fi

# Check client files
echo ""
echo "3️⃣  Checking Client Setup..."
if [ -f "client/package.json" ]; then
    echo "   ✅ Client package.json found"
else
    echo "   ❌ Client package.json not found"
    exit 1
fi

if [ -f "client/vite.config.ts" ]; then
    echo "   ✅ Vite config found"
else
    echo "   ❌ Vite config not found"
    exit 1
fi

if [ -f "client/vercel.json" ]; then
    echo "   ✅ Vercel config found"
else
    echo "   ⚠️  Vercel config not found"
fi

# Check server files
echo ""
echo "4️⃣  Checking Server Setup..."
if [ -f "server/package.json" ]; then
    echo "   ✅ Server package.json found"
else
    echo "   ❌ Server package.json not found"
    exit 1
fi

# Check environment files
echo ""
echo "5️⃣  Checking Environment Files..."
if [ -f "server/.env" ]; then
    echo "   ✅ Server .env found"
else
    echo "   ⚠️  Server .env not found. Copy from .env.example"
fi

if [ -f "client/.env.production" ]; then
    echo "   ✅ Client .env.production found"
else
    echo "   ⚠️  Client .env.production not configured for deployment"
fi

# Check deployment docs
echo ""
echo "6️⃣  Checking Documentation..."
if [ -f "DEPLOYMENT_GUIDE.md" ]; then
    echo "   ✅ Deployment guide found"
else
    echo "   ⚠️  Deployment guide not found"
fi

if [ -f "QUICK_DEPLOY.md" ]; then
    echo "   ✅ Quick deploy reference found"
else
    echo "   ⚠️  Quick deploy reference not found"
fi

echo ""
echo "=================================="
echo "✨ Setup looks good! Ready to deploy?"
echo ""
echo "📖 Next steps:"
echo "1. Read DEPLOYMENT_GUIDE.md for detailed instructions"
echo "2. Set up MongoDB Atlas and get connection string"
echo "3. Push code to GitHub"
echo "4. Deploy backend to Render"
echo "5. Deploy frontend to Vercel"
echo ""
echo "🔗 Important URLs to save:"
echo "   - Render Backend: https://portfolio-backend-xxx.onrender.com"
echo "   - Vercel Frontend: https://portfolio-xxx.vercel.app"
echo ""
