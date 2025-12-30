#!/bin/bash

# Production Start Script
# This script starts the production servers

set -e

# Load environment variables
if [ -f .env.production ]; then
  export $(cat .env.production | grep -v '^#' | xargs)
fi

# Start web app
echo "🌐 Starting web application..."
cd apps/web
PORT=${WEB_PORT:-3000} pnpm start &

# Start admin app
echo "🔐 Starting admin application..."
cd ../admin
PORT=${ADMIN_PORT:-3001} pnpm start &

echo "✅ Applications started!"
echo "Web: http://localhost:${WEB_PORT:-3000}"
echo "Admin: http://localhost:${ADMIN_PORT:-3001}"

# Wait for all background processes
wait

