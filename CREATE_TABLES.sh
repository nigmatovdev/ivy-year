#!/bin/bash

# Quick script to create database tables
# Run this from project root: bash CREATE_TABLES.sh

set -e

echo "🔧 Creating database tables..."

cd packages/db

# Load environment variables
if [ -f .env.production ]; then
  export $(cat .env.production | grep -v '^#' | xargs)
  echo "✅ Loaded .env.production"
elif [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
  echo "✅ Loaded .env"
else
  echo "❌ Error: No .env or .env.production file found!"
  exit 1
fi

if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL not found!"
  exit 1
fi

echo "📦 Generating Prisma Client..."
pnpm db:generate

echo "🔄 Pushing schema to database (creating tables)..."
pnpm db:push --accept-data-loss

echo ""
echo "✅ Tables created successfully!"
echo ""
echo "Verifying tables..."
sudo -u postgres psql -d ivyonaire -c "\dt"

echo ""
echo "Next step: Restart applications"
echo "  pm2 restart all"

