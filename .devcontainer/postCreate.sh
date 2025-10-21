#!/usr/bin/env bash
set -euo pipefail

# Backend setup
cd backend
cp -n .env.example .env || true
pnpm install
pnpm prisma migrate dev --name init
pnpm seed

# Frontend setup
cd ../frontend
cp -n .env.example .env || true
echo "VITE_API_URL=http://localhost:4000/api" > .env.local
pnpm install

echo "✔ Dev environment prepared."
