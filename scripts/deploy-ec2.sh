#!/usr/bin/env bash
set -euo pipefail

echo "=== EC2 Deploy ==="

APP_DIR="${APP_DIR:-/home/ubuntu/shopsmart}"

cd "$APP_DIR"
git fetch origin
git reset --hard origin/main

npm ci --prefix server
npm ci --prefix client
npm run build --prefix client

pm2 describe shopsmart-server >/dev/null 2>&1 \
  && pm2 reload shopsmart-server \
  || pm2 start server/src/index.js --name shopsmart-server --env production

pm2 save

echo "=== Deploy complete ==="
