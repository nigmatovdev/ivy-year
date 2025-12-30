# PM2 Troubleshooting Guide

## Quick Diagnosis

### 1. Check PM2 Logs

```bash
# View all logs
pm2 logs

# View specific app logs
pm2 logs ivyonaire-web
pm2 logs ivyonaire-admin

# View last 100 lines
pm2 logs --lines 100

# View only errors
pm2 logs --err
```

### 2. Check Process Details

```bash
# Detailed info about a process
pm2 describe ivyonaire-web
pm2 describe ivyonaire-admin

# Show process info
pm2 show ivyonaire-web
```

## Common Issues and Fixes

### Issue 1: Build Files Missing

**Error:** `Cannot find module` or `ENOENT: no such file or directory`

**Fix:**
```bash
cd /var/www/ivy-year
pnpm build
pm2 restart all
```

### Issue 2: Environment Files Missing

**Error:** `Cannot find .env.production` or database connection errors

**Fix:**
```bash
# Check if .env.production exists
ls -la apps/web/.env.production
ls -la apps/admin/.env.production

# If missing, create them from examples
cd apps/web
cp .env.example .env.production
nano .env.production  # Edit with your values

cd ../admin
cp .env.example .env.production
nano .env.production  # Edit with your values
```

### Issue 3: Port Already in Use

**Error:** `EADDRINUSE: address already in use :::3000`

**Fix:**
```bash
# Check what's using the port
sudo lsof -i :3000
sudo lsof -i :3001

# Kill the process or change port in ecosystem.config.js
pm2 delete all
pm2 start ecosystem.config.js
```

### Issue 4: Missing Dependencies

**Error:** `Cannot find module` or `MODULE_NOT_FOUND`

**Fix:**
```bash
cd /var/www/ivy-year
pnpm install --frozen-lockfile
cd packages/db
pnpm db:generate
cd ../..
pnpm build
pm2 restart all
```

### Issue 5: Prisma Client Not Generated

**Error:** `@prisma/client did not initialize yet`

**Fix:**
```bash
cd /var/www/ivy-year/packages/db
pnpm db:generate
cd ../..
pm2 restart all
```

### Issue 6: Database Connection Failed

**Error:** `Can't reach database server` or `P1001`

**Fix:**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check database connection
sudo -u postgres psql -d ivyonaire -c "SELECT 1;"

# Verify DATABASE_URL in .env.production files
cat apps/web/.env.production | grep DATABASE_URL
cat apps/admin/.env.production | grep DATABASE_URL
```

### Issue 7: Wrong Working Directory

**Error:** Script can't find files

**Fix:**
Check `ecosystem.config.js` - `cwd` should be absolute path or relative to where PM2 is started:

```javascript
cwd: '/var/www/ivy-year/apps/web',  // Absolute path (recommended)
// OR
cwd: './apps/web',  // Relative to where you run pm2 start
```

### Issue 8: Next.js Build Not Found

**Error:** `.next` directory missing

**Fix:**
```bash
cd /var/www/ivy-year
pnpm build
pm2 restart all
```

## Step-by-Step Recovery

If processes are errored, follow these steps:

```bash
# 1. Stop all processes
pm2 delete all

# 2. Verify build exists
ls -la apps/web/.next
ls -la apps/admin/.next

# 3. If missing, rebuild
cd /var/www/ivy-year
pnpm build

# 4. Verify environment files
ls -la apps/web/.env.production
ls -la apps/admin/.env.production

# 5. Generate Prisma client
cd packages/db
pnpm db:generate
cd ../..

# 6. Start PM2
pm2 start ecosystem.config.js

# 7. Check status
pm2 status
pm2 logs --lines 50
```

## Verify Everything is Working

```bash
# Check PM2 status
pm2 status

# Check logs for errors
pm2 logs --err --lines 50

# Test web app
curl http://localhost:3000

# Test admin app
curl http://localhost:3001

# Check if ports are listening
sudo netstat -tlnp | grep -E ':(3000|3001)'
```

## Update PM2 (if needed)

If you see "In-memory PM2 is out-of-date":

```bash
pm2 update
pm2 save
```

