# CareerSight AI — Local & Docker setup

This workspace contains a frontend (client) and backend (server) for the CareerSight AI demo.

Quick local (dev) run

- Start backend (development):

```bash
cd server
npm install
npm run dev
```

- Start frontend (development):

```bash
cd client
npm install
npm run dev
```

Open the UI at `http://127.0.0.1:5173/` and the backend at `http://127.0.0.1:5000/`.

Production deploy on Render

1. Push this repo to GitHub.
2. Create a new Web Service on Render using `render.yaml`.
3. Add environment variables:

```text
MONGO_URI=<your MongoDB Atlas URI>
JWT_SECRET=<strong secret>
GEMINI_API_KEY=<optional>
NODE_ENV=production
```

4. Deploy.

The backend serves the built React app in production, so you only need one Render service.
If you want to deploy the frontend separately, set `VITE_API_BASE_URL` during the frontend build.

Docker (recommended for full stack)

1. Create an environment variable for `GEMINI_API_KEY` if you use the Gemini integration, or omit to run in demo mode.
2. Build and start everything with Docker Compose:

```bash
docker compose up --build
```

This will start:
- MongoDB on `27017`
- Backend on `5000`
- Frontend (served by nginx) on `5173`

Notes
- The server falls back to an in-memory demo store when MongoDB is not available (useful for quick testing).
- To persist data, run with Docker Compose (the compose file includes a MongoDB service) or set `MONGO_URI` to your Atlas connection string.
# CareerSight AI

Simple full-stack app to analyze resumes and recommend internship roles.

Structure:
- `server/` - Express backend
- `client/` - React + Tailwind frontend

Quick start:

1. Backend:

```powershell
cd "server"
npm install
copy .env.example .env
# set MONGO_URI and JWT_SECRET in .env
npm run dev
```

2. Frontend:

```powershell
cd "client"
npm install
npm run dev
```

Notes:
- The backend will listen on port 5000 by default. The frontend expects the API at `http://localhost:5000`.
- Set `GEMINI_API_KEY` in `server/.env` to enable Gemini analysis (placeholder endpoint in code; adjust to real API details).
