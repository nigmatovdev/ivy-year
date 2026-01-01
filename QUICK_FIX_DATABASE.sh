#!/bin/bash

# Quick Fix Script for "Table does not exist" Error
# Run this from the project root: ./QUICK_FIX_DATABASE.sh

set -e

echo "🔧 Quick Fix: Creating database tables..."

cd "$(dirname "$0")/packages/db"

# Load environment variables
if [ -f .env.production ]; then
  export $(cat .env.production | grep -v '^#' | xargs)
  echo "✅ Loaded .env.production"
elif [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
  echo "✅ Loaded .env"
else
  echo "❌ Error: No .env or .env.production file found!"
  echo "Please create packages/db/.env.production with DATABASE_URL"
  exit 1
fi

if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL not found!"
  exit 1
fi

echo "📦 Step 1: Generating Prisma Client..."
pnpm db:generate

echo "🔄 Step 2: Creating database tables..."

# Check if migrations exist
if [ -d "prisma/migrations" ] && [ "$(ls -A prisma/migrations 2>/dev/null)" ]; then
  echo "   Migrations found, deploying..."
  pnpm db:migrate:deploy
else
  echo "   No migrations found, pushing schema..."
  pnpm db:push
fi

echo ""
echo "✅ Database tables created successfully!"
echo ""
echo "Next steps:"
echo "1. Restart applications: pm2 restart all"
echo "2. Check logs: pm2 logs"
echo "3. Test creating a student in admin panel"

