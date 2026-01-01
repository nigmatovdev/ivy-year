#!/bin/bash

# Database Setup Script for Production
# This script creates the initial migration and sets up the database

set -e

echo "🚀 Starting database setup..."

# Navigate to db package
cd "$(dirname "$0")/../packages/db"

# Load environment variables
if [ -f .env.production ]; then
  export $(cat .env.production | grep -v '^#' | xargs)
  echo "✅ Loaded .env.production"
elif [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
  echo "✅ Loaded .env"
else
  echo "❌ Error: No .env or .env.production file found in packages/db/"
  echo "Please create one with DATABASE_URL"
  exit 1
fi

if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL not found in environment"
  exit 1
fi

echo "📦 Generating Prisma Client..."
pnpm db:generate

echo "🔄 Checking for existing migrations..."

# Check if migrations directory exists and has migrations
if [ -d "prisma/migrations" ] && [ "$(ls -A prisma/migrations 2>/dev/null)" ]; then
  echo "✅ Migrations found, deploying..."
  pnpm db:migrate:deploy
else
  echo "⚠️  No migrations found. Creating initial migration..."
  echo "This will create the database schema from your Prisma schema file."
  read -p "Continue? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    pnpm db:migrate dev --name init
    echo "✅ Initial migration created and applied"
  else
    echo "Using db:push instead (no migration history)..."
    pnpm db:push
    echo "✅ Database schema pushed"
  fi
fi

echo "✅ Database setup completed successfully!"

