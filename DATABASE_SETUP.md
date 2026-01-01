# Database Setup Guide

This guide will help you set up the database on your production server.

## Error: "The table `public.Student` does not exist"

This error means the database tables haven't been created yet. You need to run Prisma migrations.

## Quick Fix

### Option 1: Run Setup Script (Recommended)

```bash
cd /var/www/ivy-year
chmod +x scripts/setup-database.sh
./scripts/setup-database.sh
```

### Option 2: Manual Setup

```bash
# 1. Navigate to db package
cd /var/www/ivy-year/packages/db

# 2. Load environment variables
export $(cat .env.production | grep -v '^#' | xargs)

# 3. Generate Prisma Client
pnpm db:generate

# 4. Create and run migrations
pnpm db:migrate dev --name init

# OR if you just want to push the schema (no migration history):
pnpm db:push
```

### Option 3: Deploy Existing Migrations

If you already have migrations in `packages/db/prisma/migrations/`:

```bash
cd /var/www/ivy-year/packages/db
export $(cat .env.production | grep -v '^#' | xargs)
pnpm db:generate
pnpm db:migrate:deploy
```

## Step-by-Step Instructions

### 1. Verify Database Connection

First, make sure your database is accessible:

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Test database connection
sudo -u postgres psql -d ivyonaire -c "SELECT version();"
```

### 2. Verify Environment Variables

Check that `DATABASE_URL` is set in `packages/db/.env.production`:

```bash
cd /var/www/ivy-year/packages/db
cat .env.production
```

Should contain:
```env
DATABASE_URL="postgresql://ivyonaire_user:password@localhost:5432/ivyonaire?schema=public"
```

### 3. Fix Database Permissions (if needed)

If you get "permission denied for schema public" errors:

```bash
sudo -u postgres psql -d ivyonaire << EOF
GRANT ALL ON SCHEMA public TO ivyonaire_user;
GRANT CREATE ON SCHEMA public TO ivyonaire_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ivyonaire_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ivyonaire_user;
\q
EOF
```

### 4. Run Migrations

**For First-Time Setup:**

```bash
cd /var/www/ivy-year/packages/db

# Option A: Create migration (recommended)
pnpm db:migrate dev --name init

# Option B: Push schema directly (faster, no migration history)
pnpm db:push
```

**For Production (if migrations exist):**

```bash
cd /var/www/ivy-year/packages/db
pnpm db:migrate:deploy
```

### 5. Verify Tables Created

Check that tables were created:

```bash
sudo -u postgres psql -d ivyonaire -c "\dt"
```

You should see tables like:
- Student
- IELTSProgress
- SATProgress
- PortfolioProject
- InternationalAdmit

### 6. Restart Applications

After creating tables, restart your applications:

```bash
pm2 restart all
```

## Troubleshooting

### Error: "No migration found"

**Solution:** Create the initial migration:
```bash
cd /var/www/ivy-year/packages/db
pnpm db:migrate dev --name init
```

### Error: "permission denied for schema public"

**Solution:** Run the permission fix above.

### Error: "relation already exists"

**Solution:** Tables might already exist. Check with `\dt` in psql. If tables exist, you can skip migration or use `db:push` instead.

### Error: DATABASE_URL not found

**Solution:** 
1. Check `.env.production` exists in `packages/db/`
2. Export variables manually: `export $(cat .env.production | grep -v '^#' | xargs)`
3. Or use the setup script which loads them automatically

### Check Migration Status

```bash
cd /var/www/ivy-year/packages/db
pnpm prisma migrate status
```

This shows which migrations have been applied.

## Verification Checklist

After setup, verify:

- [ ] Database connection works
- [ ] Tables created (`\dt` shows all tables)
- [ ] Prisma Client generated
- [ ] Applications can connect to database
- [ ] No errors in PM2 logs

## Next Steps

After database is set up:

1. Restart applications: `pm2 restart all`
2. Check logs: `pm2 logs`
3. Test creating a student in admin panel
4. Verify student pages load correctly

## Common Commands Reference

```bash
# Generate Prisma Client
pnpm db:generate

# Create new migration
pnpm db:migrate dev --name migration_name

# Deploy migrations (production)
pnpm db:migrate:deploy

# Push schema (no migrations)
pnpm db:push

# Check migration status
pnpm prisma migrate status

# Open Prisma Studio (GUI)
pnpm db:studio
```

