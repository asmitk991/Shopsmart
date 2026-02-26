#!/usr/bin/env bash
set -euo pipefail

echo "=== ShopSmart Setup ==="

mkdir -p logs
mkdir -p data
mkdir -p test-results

if [ ! -d "node_modules" ]; then
  npm ci
fi

if [ ! -d "server/node_modules" ]; then
  npm ci --prefix server
fi

if [ ! -d "client/node_modules" ]; then
  npm ci --prefix client
fi

cd server
DATABASE_URL="${DATABASE_URL:-file:./dev.db}" npm run prisma:migrate
cd ..

echo "=== Setup complete ==="
