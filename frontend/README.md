# Frontend — RAG Docs App

This frontend is built with React + Vite + TypeScript + Redux Toolkit + MUI.

## Run locally
1. copy `.env.example` to `.env` and ensure `VITE_API_BASE` points to the backend (default: http://localhost:8000)
2. install deps: `pnpm install` (or `npm install`)
3. start: `pnpm dev` (http://localhost:5173)

## Notes
- Auth tokens are stored in localStorage (simple approach for the exercise). You can improve with refresh tokens or http-only cookies in production.
- API interactions are simple axios calls to the backend endpoints created earlier.
