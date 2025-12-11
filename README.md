# EduVillage

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](#)
[![Frontend](https://img.shields.io/badge/frontend-React%20%2B%20Vite-yellow)](#)
[![Backend](https://img.shields.io/badge/backend-Node.js%20%2B%20Express-brightgreen)](#)

An educational platform for children aged 4–8 in rural communities. EduVillage focuses on highly visual, interactive, and intuitive experiences with minimal text. It provides two primary roles: Child and Educator.

Table of contents
- About
- Features
  - Child
  - Educator
- Architecture
- Quick start
  - Prerequisites
  - Backend
  - Frontend
- Default seeded accounts
- Notes & Production
- Scripts
- Contributing
- License
- Acknowledgements

## About

EduVillage is built to be simple for young children while giving educators tools to manage content and monitor learning. Lessons are image-first with audio narration and interactive quizzes designed for low-literacy contexts.

## Features

Child Interface
- Visual Learning Hub with large tappable icons for lessons.
- Lesson Player: picture-based story player with audio narration, next/prev, and replay controls.
- Interactive Quizzes: drag-and-drop / matching with instant feedback, friendly sounds, and badge rewards when score >= 80%.
- Progress & Motivation: badges, level-up unlocks, and a visual map to show progress.

Educator Interface
- Secure login (JWT-based).
- Dashboard with charts: average scores, completion rates, topic filters, and per-child performance.
- Content Management: create and edit lessons/quizzes, set default difficulty for class (basic/advanced).
- Performance endpoints for aggregated reporting.

API (example key routes)
- Auth: POST /api/educator/login, GET /api/educator/verify
- Lessons: GET /api/lessons, GET /api/lessons/:lessonId
- Quizzes: GET /api/quizzes/:quizId
- Progress: POST /api/progress/lesson, POST /api/quizzes/submit, POST /api/progress/update
- Performance: GET /api/performance/:educatorId, GET /api/performance/:educatorId/children
- Educator Settings: GET/POST /api/educator/:educatorId/settings

Non-functional goals
- Near real-time validation (<500ms) for quizzes where possible.
- Robust error handling for missing audio, access denied, or unavailable quizzes.
- Maintainable structure for adding lessons and quizzes.

## Architecture

This repository follows a monorepo layout:

- backend/ — Node.js + Express + TypeScript + Prisma (SQLite by default)
- frontend/ — React + Vite (TypeScript)

## Quick start

1) Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- Optional: SQLite CLI for inspecting the database

2) Backend setup
```bash
cd backend
cp .env.example .env
pnpm install
pnpm prisma migrate dev --name init
pnpm prisma db seed
pnpm dev
```
Backend API runs by default at: http://localhost:4000

3) Frontend setup
```bash
cd frontend
cp .env.example .env
pnpm install
pnpm dev
```
Frontend runs by default at: http://localhost:5173

## Default seeded accounts

- Educator
  - email: teacher@example.com
  - password: password123

- Seeded child profile
  - Child ID 1 is linked to the above educator (see seed data).

## Notes & Production

- Assets in frontend/public/assets are placeholders — replace images/audio and update seeders or DB accordingly.
- To use a production DB: switch from SQLite to Postgres by updating DATABASE_URL in backend/.env and run migrations.
- Validate file and audio upload sizes and configure limits in backend if exposing file uploads.

## Scripts

Backend
- pnpm dev — start dev server (ts-node-dev)
- pnpm build && pnpm start — build and run production server
- pnpm prisma studio — open Prisma Studio

Frontend
- pnpm dev — Vite dev server
- pnpm build — production build
- pnpm preview — preview production build

## License

This project is licensed under the MIT License — see the LICENSE file for details.
