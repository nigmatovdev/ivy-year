const path = require('path');

module.exports = {
  apps: [
    {
      name: 'ivyonaire-web',
      cwd: path.resolve(__dirname, 'apps/web'),
      interpreter: 'node',
      script: path.resolve(__dirname, 'apps/web/node_modules/next/dist/bin/next'),
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      instances: 2,
      exec_mode: 'cluster',
      error_file: path.resolve(__dirname, 'logs/ivyonaire-web-error.log'),
      out_file: path.resolve(__dirname, 'logs/ivyonaire-web-out.log'),
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '1G',
      watch: false,
      min_uptime: '10s',
      max_restarts: 10,
    },
    {
      name: 'ivyonaire-admin',
      cwd: path.resolve(__dirname, 'apps/admin'),
      interpreter: 'node',
      script: path.resolve(__dirname, 'apps/admin/node_modules/next/dist/bin/next'),
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      instances: 1,
      exec_mode: 'fork',
      error_file: path.resolve(__dirname, 'logs/ivyonaire-admin-error.log'),
      out_file: path.resolve(__dirname, 'logs/ivyonaire-admin-out.log'),
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '1G',
      watch: false,
      min_uptime: '10s',
      max_restarts: 10,
    },
  ],
};

