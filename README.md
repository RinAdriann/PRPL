# EduVillage

An educational platform for children aged 4–8 in rural communities. Highly visual, interactive, and intuitive with minimal text. Two roles: Child and Educator.

- Frontend: React (Vite, TypeScript), responsive, icon-based navigation, drag-and-drop quizzes, audio lessons, progress map, badges.
- Backend: Node.js (Express + TypeScript), Prisma ORM (SQLite by default), JWT auth for Educators, performance aggregation endpoints, robust error handling.

## Features

Child Interface:
- Visual Learning Hub: large tappable icons for lessons
- Lesson Player: picture-based story with audio narration, next/prev, replay
- Interactive Quizzes: drag-and-drop matching with instant feedback, happy/gentle sounds, badge rewards if score >= 80%
- Progress & Motivation: badges, level-up unlocks, map visualization

Educator Interface:
- Secure Login with JWT
- Dashboard with charts: average scores, completion rates, filter by topic, child-wise performance
- Content Management: set difficulty level (basic/advanced) for class content

API (key routes):
- Auth: POST /api/educator/login, GET /api/educator/verify
- Lessons: GET /api/lessons, GET /api/lessons/:lessonId
- Quizzes: GET /api/quizzes/:quizId
- Progress: POST /api/progress/lesson, POST /api/quizzes/submit, POST /api/progress/update
- Performance: GET /api/performance/:educatorId, GET /api/performance/:educatorId/children
- Educator Settings: GET/POST /api/educator/:educatorId/settings (difficulty management)

Non-functional:
- Near real-time validation (<500ms) for quizzes
- Exception handling: quiz not available, audio not found, access denied, etc.
- Maintainable structure for adding lessons/quizzes

## Monorepo Structure

- backend/ (Express + Prisma)
- frontend/ (React + Vite)

## Quick Start

1) Prereqs:
- Node.js 18+
- pnpm or npm
- Optional: SQLite CLI (for inspecting DB)

2) Backend setup:
- cd backend
- cp .env.example .env
- pnpm install
- pnpm prisma migrate dev --name init
- pnpm prisma db seed
- pnpm dev

API runs at http://localhost:4000

3) Frontend setup:
- cd frontend
- cp .env.example .env
- pnpm install
- pnpm dev

App front-end runs at http://localhost:5173

Default seeded educator:
- email: teacher@example.com
- password: password123

Seeded child profile: Child ID 1 is linked to the above educator.

## Notes

- Assets are placeholders; replace images/audio in frontend/public/assets and update database or seeders.
- Difficulty filter: Educators set default difficulty for their class. Frontend fetches educator settings and filters lessons/quizzes accordingly.
- For production: switch SQLite to Postgres by updating DATABASE_URL in backend/.env and running migrations.

## Scripts

- Backend:
  - pnpm dev: start dev server with ts-node-dev
  - pnpm build && pnpm start: build and run
  - pnpm prisma studio: open Prisma Studio
- Frontend:
  - pnpm dev: Vite dev server
  - pnpm build: production build
  - pnpm preview: preview prod build
