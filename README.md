# ShopSmart

ShopSmart is a full-stack e-commerce demo with a React + Vite client and an Express + Prisma
backend backed by SQLite. This repository now includes testing, Docker, Terraform scaffolding, CI
workflows, and local automation scripts for a production-style DevOps setup.

## Local development

- Install dependencies with `npm install`, `npm install --prefix server`, and
  `npm install --prefix client`.
- Apply the database migration with `cd server && DATABASE_URL=file:./dev.db npx prisma migrate deploy`.
- Run the backend with `npm run dev --prefix server`.
- Run the frontend with `npm run dev --prefix client`.

## Key commands

- `npm run lint`
- `npm run format:check`
- `npm run test --prefix server`
- `npm run test --prefix client`
- `npm run test:e2e`
