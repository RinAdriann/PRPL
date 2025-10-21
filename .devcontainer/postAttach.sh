#!/usr/bin/env bash
set -euo pipefail

# Start backend and frontend
(cd backend && pnpm dev) & 
(cd frontend && pnpm dev) & 
wait
