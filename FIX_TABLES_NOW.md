# Quick Fix: Create Missing Tables

Your database has the migrations table but no data tables. Here's how to fix it:

## Quick Solution (Recommended)

Run this command on your server:

```bash
cd /var/www/ivy-year/packages/db
export $(cat .env.production | grep -v '^#' | xargs)
pnpm db:generate
pnpm db:push --accept-data-loss
```

Or use the script:

```bash
cd /var/www/ivy-year
chmod +x CREATE_TABLES.sh
bash CREATE_TABLES.sh
```

## Verify Tables Created

After running the command, verify tables exist:

```bash
sudo -u postgres psql -d ivyonaire -c "\dt"
```

You should now see:
- Student
- IELTSProgress
- SATProgress
- PortfolioProject
- InternationalAdmit
- _prisma_migrations

## Restart Applications

```bash
pm2 restart all
pm2 logs
```

## Why This Happened

The `_prisma_migrations` table exists but no data tables. This means:
- Prisma was initialized
- But migrations didn't create the actual tables
- Using `db:push` will create tables directly from your schema

## Alternative: Create Proper Migration

If you want to use migrations instead:

```bash
cd /var/www/ivy-year/packages/db
export $(cat .env.production | grep -v '^#' | xargs)
pnpm db:migrate dev --name init
```

But `db:push` is faster for first-time setup.

