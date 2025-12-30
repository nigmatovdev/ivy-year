#!/bin/bash

# Prisma Migration Script for Production
# This script runs migrations in production environment

set -e

echo "🚀 Starting database migration..."

# Navigate to db package
cd "$(dirname "$0")/../packages/db"

# Load environment variables
if [ -f .env.production ]; then
  export $(cat .env.production | grep -v '^#' | xargs)
elif [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
else
  echo "❌ Error: No .env or .env.production file found in packages/db/"
  exit 1
fi

# Generate Prisma Client
echo "📦 Generating Prisma Client..."
pnpm db:generate

# Run migrations
echo "🔄 Running database migrations..."
pnpm db:migrate:deploy

echo "✅ Migration completed successfully!"

