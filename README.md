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

The repo is set up to deploy with the frontend on Netlify and the backend on Render.

1. Push this repo to GitHub.
2. Create a Render Web Service for the backend and point it at `render.yaml`.
3. Set these environment variables in Render:

```text
NODE_ENV=production
MONGO_URI=<your MongoDB Atlas URI>
JWT_SECRET=<strong secret>
GEMINI_API_KEY=<optional>
```

4. Create a Netlify site for the `client` folder.
5. Keep the Netlify build command as `npm ci && npm run build` and publish directory as `dist`.
6. Deploy the frontend.

Netlify proxies `/api/*` to the Render backend, so the frontend can call `/api/auth/...` and `/api/resume/...` without hardcoding a backend URL.

## Docker

If you prefer containers, use Docker Compose:

```bash
docker compose up --build
```

## Notes

- The server falls back to a demo/in-memory mode if MongoDB is not available.
- Set `GEMINI_API_KEY` to enable Gemini-based analysis; otherwise the local heuristic runs.
- If you deploy the frontend separately and do not use the Netlify proxy, set `VITE_API_BASE_URL` to the live backend URL.
