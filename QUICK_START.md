# Quick Start - Production Deployment

This is a condensed guide for deploying Ivyonaire to a Linux server.

## Prerequisites Check

```bash
node --version  # Should be 18+
pnpm --version  # Should be 8+
psql --version  # Should be 14+
nginx -v
pm2 --version
```

## 1. Database Setup

```bash
# Create database
sudo -u postgres createdb ivyonaire
sudo -u postgres createuser ivyonaire_user -P

# Grant permissions (including schema permissions)
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ivyonaire TO ivyonaire_user;"
sudo -u postgres psql -d ivyonaire -c "GRANT ALL ON SCHEMA public TO ivyonaire_user;"
sudo -u postgres psql -d ivyonaire -c "GRANT CREATE ON SCHEMA public TO ivyonaire_user;"
sudo -u postgres psql -d ivyonaire -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ivyonaire_user;"
sudo -u postgres psql -d ivyonaire -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ivyonaire_user;"
```

## 2. Configure Environment

```bash
# Web app
cd apps/web
cp .env.example .env.production
nano .env.production  # Edit with your values

# Admin app
cd ../admin
cp .env.example .env.production
nano .env.production  # Edit with your values

# Database package
cd ../../packages/db
cp .env.example .env.production
nano .env.production  # Edit DATABASE_URL
```

## 3. Build & Deploy

```bash
# From project root
pnpm install --frozen-lockfile
pnpm build
pnpm migrate

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 4. Configure Nginx

```bash
# Copy configs from DEPLOYMENT.md
sudo nano /etc/nginx/sites-available/ivyonaire-web
sudo nano /etc/nginx/sites-available/ivyonaire-admin

# Enable sites
sudo ln -s /etc/nginx/sites-available/ivyonaire-web /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/ivyonaire-admin /etc/nginx/sites-enabled/

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

## 5. SSL Setup

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo certbot --nginx -d admin.yourdomain.com
```

## Common Commands

```bash
# View logs
pm2 logs

# Restart apps
pm2 restart all

# Check status
pm2 status

# Database backup
pg_dump -U ivyonaire_user ivyonaire > backup.sql
```

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

