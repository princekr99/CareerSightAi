# CareerSight AI

CareerSight AI is a full-stack resume analysis app that scores resumes, detects skills, and suggests internship roles with a simple improvement roadmap.

## Project Structure

- `server/` - Express API, auth, resume upload, analysis
- `client/` - React + Tailwind frontend
- `render.yaml` - One-click Render deployment config

## Local Development

Run the backend:

```powershell
cd server
npm install
copy .env.example .env
npm run dev
```

Run the frontend:

```powershell
cd client
npm install
npm run dev
```

Open the app at `http://localhost:5173/`.

## Production Deploy

The repo is set up to deploy as a single Render service.

1. Push this repo to GitHub.
2. Create a new Render Web Service and point it at `render.yaml`.
3. Set these environment variables in Render:

```text
NODE_ENV=production
MONGO_URI=<your MongoDB Atlas URI>
JWT_SECRET=<strong secret>
GEMINI_API_KEY=<optional>
```

4. Deploy.

In production, the backend serves the built frontend automatically.

## Docker

If you prefer containers, use Docker Compose:

```bash
docker compose up --build
```

## Notes

- The server falls back to a demo/in-memory mode if MongoDB is not available.
- Set `GEMINI_API_KEY` to enable Gemini-based analysis; otherwise the local heuristic runs.
- If you deploy the frontend separately, set `VITE_API_BASE_URL` to the live backend URL.
