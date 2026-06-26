CareerSight AI - Backend

Setup:

1. Copy `.env.example` to `.env` and fill `MONGO_URI` and `JWT_SECRET`.
2. Install dependencies: `npm install`.
3. Run in dev: `npm run dev` (requires `nodemon`).

Endpoints:
- `POST /api/auth/signup` {name,email,password}
- `POST /api/auth/login` {email,password}
- `POST /api/resume/upload` form-data `resume` file (PDF)

The resume analysis will use Gemini if `GEMINI_API_KEY` is provided; otherwise a local heuristic.
