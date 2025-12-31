# Authentication Troubleshooting Guide

If you're seeing "Invalid credentials" errors, follow this guide to diagnose and fix the issue.

## Common Issues and Solutions

### 1. Environment Variables Not Loaded

**Problem:** Environment variables are not being read by Next.js.

**Solution:**

1. Ensure `.env.production` file exists in `apps/admin/` directory:
   ```bash
   cd apps/admin
   ls -la .env.production
   ```

2. Check that the file contains all required variables:
   ```env
   ADMIN_EMAIL="admin@ivyonaire.com"
   ADMIN_PASSWORD="your-password"
   # OR use hashed password (recommended for production)
   ADMIN_PASSWORD_HASH="$2a$10$..."
   NEXTAUTH_SECRET="your-secret-key-32-chars-minimum"
   NEXTAUTH_URL="https://admin.yourdomain.com"
   NODE_ENV="production"
   ```

3. **Restart the application** after changing environment variables:
   ```bash
   pm2 restart ivyonaire-admin
   ```

### 2. Wrong Password Hash Format

**Problem:** The bcrypt hash in `ADMIN_PASSWORD_HASH` is incorrect or malformed.

**Solution:**

Generate a new bcrypt hash:

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your-password', 10).then(hash => console.log(hash))"
```

Copy the entire output (should start with `$2a$10$` or `$2b$10$`) to your `.env.production`:

```env
ADMIN_PASSWORD_HASH="$2a$10$abcdefghijklmnopqrstuvwxyz..."
```

**Important:** 
- Include the `$2a$10$` prefix
- The hash should be exactly 60 characters long
- Don't wrap it in quotes if it's already in the env file format

### 3. Using Plain Text Password (Development Only)

For quick testing, you can use a plain text password:

```env
ADMIN_PASSWORD="your-plain-password"
```

**⚠️ Warning:** Only use this for development/testing. Never use plain text passwords in production!

### 4. Email Mismatch

**Problem:** The email you're entering doesn't match `ADMIN_EMAIL`.

**Solution:**

1. Check your `.env.production`:
   ```env
   ADMIN_EMAIL="admin@ivyonaire.com"
   ```

2. Make sure you're logging in with the exact same email (case-insensitive, but must match exactly after trimming).

### 5. NextAuth Secret Missing

**Problem:** `NEXTAUTH_SECRET` is not set or too short.

**Solution:**

Generate a secure secret:

```bash
openssl rand -base64 32
```

Or use Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Add to `.env.production`:

```env
NEXTAUTH_SECRET="your-generated-secret-here"
```

### 6. Environment Variables in Production Build

**Problem:** Next.js doesn't automatically load `.env.production` at runtime.

**Solutions:**

**Option A: Use PM2 env_file (Recommended)**

Update `ecosystem.config.js`:

```javascript
{
  name: 'ivyonaire-admin',
  // ... other config
  env_file: '.env.production',  // PM2 will load this
  env: {
    NODE_ENV: 'production',
    PORT: 3001,
  },
}
```

**Option B: Load environment variables manually**

Create a script to load env vars before starting:

```bash
#!/bin/bash
export $(cat apps/admin/.env.production | grep -v '^#' | xargs)
pm2 start ecosystem.config.js
```

**Option C: Use system environment variables**

Set environment variables in your shell/system before starting PM2:

```bash
export ADMIN_EMAIL="admin@ivyonaire.com"
export ADMIN_PASSWORD="your-password"
export NEXTAUTH_SECRET="your-secret"
pm2 start ecosystem.config.js
pm2 save
```

### 7. Debugging Authentication

Enable debug logging by setting `AUTH_DEBUG=true` in your environment:

```env
AUTH_DEBUG="true"
```

Then check your PM2 logs:

```bash
pm2 logs ivyonaire-admin
```

You'll see detailed logs about:
- Whether environment variables are loaded
- Email comparisons
- Password verification steps

### 8. Quick Diagnostic Checklist

Run these checks:

```bash
# 1. Check if env file exists
ls -la apps/admin/.env.production

# 2. Check if variables are set (without exposing values)
cd apps/admin
grep -E "ADMIN_EMAIL|ADMIN_PASSWORD|NEXTAUTH_SECRET" .env.production | sed 's/=.*/=***/'

# 3. Check PM2 logs for auth errors
pm2 logs ivyonaire-admin --lines 50 | grep -i auth

# 4. Test password hash generation
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('test', 10).then(hash => console.log('Hash length:', hash.length, 'Starts with:', hash.substring(0, 7)))"

# 5. Verify environment variables are loaded at runtime
pm2 logs ivyonaire-admin | grep "Environment check"
```

## Step-by-Step Fix

1. **Stop the application:**
   ```bash
   pm2 stop ivyonaire-admin
   ```

2. **Verify environment file:**
   ```bash
   cd apps/admin
   cat .env.production
   ```

3. **Generate new password hash (if needed):**
   ```bash
   node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YOUR_PASSWORD', 10).then(hash => console.log('ADMIN_PASSWORD_HASH=\"' + hash + '\"'))"
   ```

4. **Update .env.production:**
   ```env
   ADMIN_EMAIL="admin@ivyonaire.com"
   ADMIN_PASSWORD_HASH="paste-generated-hash-here"
   NEXTAUTH_SECRET="your-secret-32-chars-minimum"
   NEXTAUTH_URL="https://admin.yourdomain.com"
   NODE_ENV="production"
   AUTH_DEBUG="true"  # Enable for debugging
   ```

5. **Restart application:**
   ```bash
   pm2 restart ivyonaire-admin
   pm2 logs ivyonaire-admin
   ```

6. **Try logging in and check logs:**
   ```bash
   pm2 logs ivyonaire-admin --lines 100
   ```

## Still Not Working?

1. Check server console logs for detailed error messages
2. Verify you're using the correct email and password
3. Ensure PM2 is loading the environment file correctly
4. Try using `ADMIN_PASSWORD` (plain text) temporarily to test if it's a hash issue
5. Check that bcryptjs is installed: `npm list bcryptjs`
6. Verify NextAuth is working: Check `/api/auth/signin` endpoint

## Security Notes

- Always use `ADMIN_PASSWORD_HASH` in production, never `ADMIN_PASSWORD`
- Keep your `.env.production` file secure and never commit it to git
- Use a strong `NEXTAUTH_SECRET` (32+ characters)
- Regenerate secrets if you suspect they've been compromised

