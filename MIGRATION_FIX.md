# Database Migration Permission Fix

## Problem

You're encountering two errors when running `pnpm db:migrate:deploy`:

1. **"No migration found in prisma/migrations"** - The migrations directory is empty
2. **"ERROR: permission denied for schema public"** - The database user lacks proper schema permissions

## Solution

### Step 1: Fix Database Permissions

Run this command on your Linux server to grant the necessary permissions:

```bash
sudo -u postgres psql -d ivyonaire << EOF
GRANT ALL ON SCHEMA public TO ivyonaire_user;
GRANT CREATE ON SCHEMA public TO ivyonaire_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ivyonaire_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ivyonaire_user;
\q
EOF
```

Or use the provided script:

```bash
sudo ./scripts/fix-db-permissions.sh
```

### Step 2: Create Initial Migration

Since there are no migrations yet, you need to create them first. Choose one of these options:

#### Option A: Create Migration (Recommended for Production)

```bash
cd packages/db
pnpm db:generate
pnpm db:migrate dev --name init
pnpm db:migrate:deploy
```

This creates a migration file that can be tracked in version control.

#### Option B: Push Schema Directly (Quick Setup)

```bash
cd packages/db
pnpm db:generate
pnpm db:push
```

This directly applies the schema without creating migration files. Use this for quick setup, but migrations are better for production.

## Prevention

To prevent this issue in the future, make sure your database setup includes schema permissions. The updated `DEPLOYMENT.md` now includes these permissions in the initial database setup.

## Updated Files

- `DEPLOYMENT.md` - Added schema permission grants to database setup
- `QUICK_START.md` - Added schema permission grants
- `scripts/fix-db-permissions.sh` - New script to fix permissions

## Verification

After fixing permissions and creating migrations, verify everything works:

```bash
# Check that migrations were created
ls packages/db/prisma/migrations/

# Verify database connection
cd packages/db
pnpm db:studio  # Opens Prisma Studio to view database
```

