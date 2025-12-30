# Ivyonaire - Linux Server Deployment Guide

This guide covers deploying the Ivyonaire monorepo to a Linux server using PM2, Nginx, and PostgreSQL.

## Prerequisites

- Ubuntu 20.04+ or similar Linux distribution
- Node.js 18+ and pnpm 8+
- PostgreSQL 14+
- Nginx
- PM2 (Process Manager)
- SSL certificate (Let's Encrypt recommended)

## Table of Contents

1. [Server Setup](#server-setup)
2. [Database Setup](#database-setup)
3. [Application Setup](#application-setup)
4. [Nginx Configuration](#nginx-configuration)
5. [PM2 Configuration](#pm2-configuration)
6. [SSL Setup](#ssl-setup)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Troubleshooting](#troubleshooting)

---

## Server Setup

### 1. Update System

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Node.js and pnpm

```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm
npm install -g pnpm@8.15.0

# Verify installations
node --version  # Should be 18.x or higher
pnpm --version  # Should be 8.x or higher
```

### 3. Install PostgreSQL

```bash
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE ivyonaire;
CREATE USER ivyonaire_user WITH ENCRYPTED PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE ivyonaire TO ivyonaire_user;
\c ivyonaire
GRANT ALL ON SCHEMA public TO ivyonaire_user;
GRANT CREATE ON SCHEMA public TO ivyonaire_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ivyonaire_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ivyonaire_user;
\q
EOF
```

### 4. Install Nginx

```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 5. Install PM2

```bash
npm install -g pm2
```

---

## Database Setup

### 1. Configure Database Connection

Create the database environment file:

```bash
cd /path/to/ivy-year/packages/db
nano .env.production
```

Add your database connection:

```env
DATABASE_URL="postgresql://ivyonaire_user:your_secure_password_here@localhost:5432/ivyonaire?schema=public"
```

### 2. Fix Database Permissions (if needed)

If you're getting "permission denied for schema public" errors, run:

```bash
sudo -u postgres psql -d ivyonaire << EOF
GRANT ALL ON SCHEMA public TO ivyonaire_user;
GRANT CREATE ON SCHEMA public TO ivyonaire_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ivyonaire_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ivyonaire_user;
\q
EOF
```

### 3. Run Migrations

**If you have migrations in `packages/db/prisma/migrations/`:**

```bash
cd /path/to/ivy-year
chmod +x scripts/migrate.sh
./scripts/migrate.sh
```

Or manually:

```bash
cd packages/db
pnpm db:generate
pnpm db:migrate:deploy
```

**If you don't have migrations yet (first-time setup):**

You have two options:

**Option A: Create initial migration (recommended for production)**
```bash
cd packages/db
pnpm db:generate
pnpm db:migrate dev --name init
pnpm db:migrate:deploy
```

**Option B: Push schema directly (faster, but no migration history)**
```bash
cd packages/db
pnpm db:generate
pnpm db:push
```

---

## Application Setup

### 1. Clone and Install

```bash
# Clone repository (or upload your code)
cd /var/www
git clone <your-repo-url> ivy-year
cd ivy-year

# Install dependencies
pnpm install --frozen-lockfile
```

### 2. Configure Environment Variables

#### Web App Environment

```bash
cd apps/web
nano .env.production
```

```env
DATABASE_URL="postgresql://ivyonaire_user:password@localhost:5432/ivyonaire?schema=public"
NEXTAUTH_SECRET="your-super-secret-key-minimum-32-characters-long"
NEXTAUTH_URL="https://yourdomain.com"
NEXT_PUBLIC_WEB_URL="https://yourdomain.com"
NODE_ENV="production"
```

#### Admin App Environment

```bash
cd apps/admin
nano .env.production
```

```env
DATABASE_URL="postgresql://ivyonaire_user:password@localhost:5432/ivyonaire?schema=public"
NEXTAUTH_SECRET="your-super-secret-key-minimum-32-characters-long"
NEXTAUTH_URL="https://admin.yourdomain.com"
NEXT_PUBLIC_ADMIN_URL="https://admin.yourdomain.com"
ADMIN_EMAIL="admin@ivyonaire.com"
ADMIN_PASSWORD_HASH="your-bcrypt-hashed-password"
NODE_ENV="production"
```

**Generate bcrypt hash for admin password:**

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your-password', 10).then(hash => console.log(hash))"
```

### 3. Build Applications

```bash
cd /var/www/ivy-year
chmod +x scripts/build.sh
./scripts/build.sh
```

Or manually:

```bash
# Generate Prisma Client
cd packages/db
pnpm db:generate

# Build all apps
cd ../..
pnpm build
```

---

## PM2 Configuration

### 1. Create PM2 Ecosystem File

```bash
cd /var/www/ivy-year
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [
    {
      name: 'ivyonaire-web',
      cwd: '/var/www/ivy-year/apps/web',
      script: 'node_modules/.bin/next',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      env_file: '.env.production',
      instances: 2,
      exec_mode: 'cluster',
      error_file: '/var/log/pm2/ivyonaire-web-error.log',
      out_file: '/var/log/pm2/ivyonaire-web-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '1G',
    },
    {
      name: 'ivyonaire-admin',
      cwd: '/var/www/ivy-year/apps/admin',
      script: 'node_modules/.bin/next',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      env_file: '.env.production',
      instances: 1,
      exec_mode: 'fork',
      error_file: '/var/log/pm2/ivyonaire-admin-error.log',
      out_file: '/var/log/pm2/ivyonaire-admin-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '1G',
    },
  ],
};
```

### 2. Create Log Directory

```bash
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2
```

### 3. Start Applications with PM2

```bash
cd /var/www/ivy-year
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

Follow the command output to enable PM2 on system boot.

### 4. PM2 Useful Commands

```bash
# View status
pm2 status

# View logs
pm2 logs ivyonaire-web
pm2 logs ivyonaire-admin

# Restart apps
pm2 restart all
pm2 restart ivyonaire-web

# Stop apps
pm2 stop all

# Monitor
pm2 monit
```

---

## Nginx Configuration

### 1. Web App Configuration

```bash
sudo nano /etc/nginx/sites-available/ivyonaire-web
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS (after SSL setup)
    # return 301 https://$server_name$request_uri;

    # For initial setup, use this:
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "origin-when-cross-origin" always;
}
```

### 2. Admin App Configuration

```bash
sudo nano /etc/nginx/sites-available/ivyonaire-admin
```

```nginx
server {
    listen 80;
    server_name admin.yourdomain.com;

    # Redirect HTTP to HTTPS (after SSL setup)
    # return 301 https://$server_name$request_uri;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer" always;
}
```

### 3. Enable Sites

```bash
sudo ln -s /etc/nginx/sites-available/ivyonaire-web /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/ivyonaire-admin /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## SSL Setup

### 1. Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Obtain SSL Certificates

```bash
# For web app
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# For admin app
sudo certbot --nginx -d admin.yourdomain.com
```

### 3. Update Nginx Configs for HTTPS

After SSL setup, update your Nginx configs to include SSL:

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # ... rest of config
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

### 4. Auto-renewal

Certbot sets up auto-renewal automatically. Test it:

```bash
sudo certbot renew --dry-run
```

---

## Monitoring & Maintenance

### 1. Set Up Log Rotation

```bash
sudo nano /etc/logrotate.d/pm2
```

```
/var/log/pm2/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    missingok
    create 0640 $USER $USER
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
```

### 2. Database Backups

Create backup script:

```bash
sudo nano /usr/local/bin/backup-ivyonaire-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/ivyonaire"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

pg_dump -U ivyonaire_user ivyonaire > $BACKUP_DIR/ivyonaire_$DATE.sql
gzip $BACKUP_DIR/ivyonaire_$DATE.sql

# Keep only last 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
```

```bash
sudo chmod +x /usr/local/bin/backup-ivyonaire-db.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-ivyonaire-db.sh
```

### 3. Update Application

```bash
cd /var/www/ivy-year

# Pull latest changes
git pull

# Install dependencies
pnpm install --frozen-lockfile

# Run migrations if needed
./scripts/migrate.sh

# Rebuild
pnpm build

# Restart PM2
pm2 restart all
```

---

## Troubleshooting

### Check Application Logs

```bash
# PM2 logs
pm2 logs

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# System logs
sudo journalctl -u nginx -f
```

### Check Database Connection

```bash
sudo -u postgres psql -d ivyonaire -c "SELECT version();"
```

### Fix "Permission Denied for Schema Public" Error

If you encounter `ERROR: permission denied for schema public` when running migrations:

```bash
# Connect to the database as postgres superuser
sudo -u postgres psql -d ivyonaire << EOF
GRANT ALL ON SCHEMA public TO ivyonaire_user;
GRANT CREATE ON SCHEMA public TO ivyonaire_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ivyonaire_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ivyonaire_user;
\q
EOF
```

### Fix "No Migration Found" Error

If you see `No migration found in prisma/migrations`, you need to create migrations first:

**Option 1: Create initial migration (recommended)**
```bash
cd packages/db
pnpm db:migrate dev --name init
pnpm db:migrate:deploy
```

**Option 2: Push schema directly (for quick setup)**
```bash
cd packages/db
pnpm db:push
```

### Check Ports

```bash
sudo netstat -tlnp | grep -E ':(3000|3001|80|443)'
```

### Restart Services

```bash
# Restart PM2
pm2 restart all

# Restart Nginx
sudo systemctl restart nginx

# Restart PostgreSQL
sudo systemctl restart postgresql
```

---

## Security Checklist

- [ ] Change default PostgreSQL password
- [ ] Use strong NEXTAUTH_SECRET (32+ characters)
- [ ] Enable firewall (UFW)
- [ ] Set up SSL certificates
- [ ] Configure fail2ban
- [ ] Regular security updates
- [ ] Database backups configured
- [ ] PM2 auto-restart enabled
- [ ] Nginx security headers configured
- [ ] Admin panel behind authentication

---

## Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Applications built successfully
- [ ] PM2 processes running
- [ ] Nginx configured and running
- [ ] SSL certificates installed
- [ ] Domain DNS configured
- [ ] Error boundaries in place
- [ ] SEO metadata configured
- [ ] Monitoring set up
- [ ] Backups configured
- [ ] Log rotation configured

---

## Support

For issues or questions, check:
- Application logs: `pm2 logs`
- Nginx logs: `/var/log/nginx/`
- Database logs: `sudo journalctl -u postgresql`

