Purpose
-------
This file gives immediate, actionable context for an AI coding agent working in this repository so it can be productive without asking many questions. Focus on the concrete patterns, commands, and files listed below.

Architecture (big picture)
- Backend: Node.js + Express app in `backend/` (entry `backend/index.js`). Exposes JSON API under `/api/*` and uses Mongoose for MongoDB models in `backend/models/`.
- Frontend: Static single-page UI served from `frontend/` (simple HTML/JS/CSS). Client code lives in `frontend/js/` and uses `fetch()` to call backend APIs.
- Data store: MongoDB (service `mongo` in `docker-compose.yml`). Docker Compose defines three services: `frontend`, `backend`, `mongo`.

Key workflows & commands
- Full stack (recommended): from repository root run Docker Compose:
  - PowerShell: `docker-compose up --build`
  - This builds `frontend` (Nginx) and `backend` (Node) and creates a `mongo` container. Compose sets `MONGO_URI=mongodb://mongo:27017/chinampa` for the backend.
- Backend local dev (fast iteration):
  - cd `backend` ; `npm install` ; set environment variables `JWT_SECRET` and `MONGO_URI` (when not using docker)
  - Start: `npm run dev` (uses `nodemon`)
- Frontend local dev:
  - The frontend is static. You can open `frontend/index.html` directly in a browser or run a static server, e.g. `npx serve frontend` or use VS Code Live Server.

Important environment variables
- `MONGO_URI` — MongoDB connection string. Docker Compose provides `mongodb://mongo:27017/chinampa` when you use `docker-compose`.
- `JWT_SECRET` — required for signing/verifying tokens. Must be set in the environment for backend to function.

API surface & patterns (concrete)
- Auth:
  - `POST /api/auth/register` — registers a user (body: `{ name, email, password, role }`). Response must return `token` and a `user` object. Note: current `register` controller has a token bug (signs a non-existent `user` variable).
  - `POST /api/auth/login` — returns `{ token, user }`. Login populates `user.id` (`user._id`) in response.
- Users:
  - `GET /api/users/me` — returns current user, uses `verifyToken` middleware.
- Projects:
  - `GET /api/projects` — projects for logged-in user (uses `req.user._id`)
  - `GET /api/projects/all` — scientist-only endpoint (`verifyScientist` middleware)
  - `GET /api/projects/:id`, `POST /api/projects`, `PUT /api/projects/:id`, `PATCH /api/projects/:id/add-action`

Security & middleware
- JWT flow: clients send `Authorization: Bearer <token>` header. Middleware `backend/middleware/verifyToken.js` and `backend/middleware/authMiddleware.js` decode the token and set `req.user` to the decoded payload (expect `req.user._id`, `req.user.role`).
- Role gating: `verifyScientist.js` checks `req.user.role === 'scientist'`.

Project-specific conventions & gotchas (do not ignore)
- User object shape is inconsistent across code:
  - Login response includes `id: user._id` in `controllers/authController.js` (login path) but register response currently omits `id` and signs token with an undefined variable `user`. When editing auth responses, ensure both `register` and `login` return the same user shape (prefer `id` or `_id` consistently) and include `role`.
- Frontend stores `token` and `user` in `localStorage` (keys: `token`, `user`). Several client files expect different shapes (`user.id` vs `user._id`) — pick one and update both server responses and client usage.
- Mock mode: `frontend/js/register.js` exposes `USE_MOCK = false`. Set to `true` to test UI without backend.
- API URLs in frontend are hard-coded to `http://localhost:3000/api/...` — when changing backend port or adding proxy, update these strings.
- Date handling: `sowingDate` and `history.date` are stored as Date objects in Mongo; front-end uses `new Date(...)` and `toLocaleDateString()` to render.

Files to inspect first when making changes
- `backend/index.js` — CORS/allowed origins, route mounting
- `backend/controllers/authController.js` — register/login token creation and response shape (known bug here)
- `backend/middleware/verifyToken.js` and `backend/middleware/authMiddleware.js` — JWT parsing and `req.user` shape
- `backend/controllers/projectController.js` and `backend/models/Project.js` — project fields (`history`, `sowingDate`, `bioFertilizer`, `synced`)
- `frontend/js/register.js`, `frontend/js/login.js`, `frontend/js/dashboard-farmer.js` — client storage, fetch usage, and role checks
- `docker-compose.yml`, `backend/Dockerfile`, `frontend/Dockerfile` — container build and ports

Integration points & external dependencies
- MongoDB (official image) — data persistence
- jwt/jsonwebtoken, bcrypt for auth and password hashing
- Chart usage on the frontend (`dashboard-scientist.js`) — frontend expects `Chart` object to be available (Chart.js must be included in HTML)

Recommended conventions for PRs and edits
- Preserve API endpoints and JSON shapes unless you update both client and server in the same PR.
- When fixing auth bugs, include a backward-compatible token and user-shape migration note in the PR description.
- Add small, reproducible tests or a README snippet showing how to run the backend locally with `JWT_SECRET` to validate auth changes.

Example quick fixes (explicit)
- Fix registration token bug in `backend/controllers/authController.js`: use `newUser` when creating the JWT payload and include `id: newUser._id` in the response.
- Make frontend `dashboard-farmer.js` use a consistent user id: read `user.id || user._id` before using it, and fix the fetch template literal (`fetch(`http://localhost:3000/api/projects?owner=${user.id}`)`)

If something's unclear
- Ask for the desired canonical `user` identifier (`id` vs `_id`) and whether you should update both server and client in a single PR.

Request for feedback
- I added the most actionable discovery items I found. Tell me which parts you want expanded (e.g., a runbook for Docker Compose failures, or a sample `.env.example`), and I will iterate.
