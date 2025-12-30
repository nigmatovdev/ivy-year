#!/bin/bash

# Production Build Script
# This script builds all apps for production

set -e

echo "🏗️  Starting production build..."

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

# Generate Prisma Client
echo "📦 Generating Prisma Client..."
cd packages/db
pnpm db:generate
cd ../..

# Build all apps
echo "🔨 Building applications..."
pnpm build

echo "✅ Build completed successfully!"

