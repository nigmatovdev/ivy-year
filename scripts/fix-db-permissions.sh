#!/bin/bash

# Database Permission Fix Script
# This script fixes PostgreSQL schema permissions for the ivyonaire_user

set -e

echo "🔧 Fixing database permissions..."

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Please run this script with sudo"
    exit 1
fi

# Database and user variables (adjust if needed)
DB_NAME="${DB_NAME:-ivyonaire}"
DB_USER="${DB_USER:-ivyonaire_user}"

echo "📋 Database: $DB_NAME"
echo "👤 User: $DB_USER"

# Fix permissions
sudo -u postgres psql -d "$DB_NAME" << EOF
GRANT ALL ON SCHEMA public TO $DB_USER;
GRANT CREATE ON SCHEMA public TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;
\q
EOF

echo "✅ Permissions fixed successfully!"
echo ""
echo "You can now run migrations:"
echo "  cd packages/db"
echo "  pnpm db:migrate:deploy"

