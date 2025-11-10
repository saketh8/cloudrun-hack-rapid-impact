# Rapid Impact Partner Assistant

Rapid Impact Partner Assistant helps small nonprofits and local agencies transform fresh field notes into donor-ready narratives, social media captions, and internal follow-up tasks in under a minute. The experience pairs a FastAPI backend with a polished Next.js frontend, both running on Google Cloud Run and backed by Google Gemini for content generation.

## Live Demo & Resources

- **Frontend:** https://rapid-impact-frontend-537372486201.us-central1.run.app
- **Backend API (health):** https://rapid-impact-backend-537372486201.us-central1.run.app/health
- **OpenAPI docs:** https://rapid-impact-backend-537372486201.us-central1.run.app/docs
- **AI Studio prompt share:** https://console.cloud.google.com/vertex-ai/studio/build?project=cloudrunhack&authuser=3&hl=en 
- **Architecture diagram:** [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## Key Features

- Guided event intake form tailored to community outreach and nonprofit teams.
- One-click generation of three polished assets: donor newsletter, social caption, and follow-up checklist.
- Copy-to-clipboard shortcuts and contextual feedback messages.
- Cloud Run-hosted services with Secret Manager-managed Gemini credentials.

## System Architecture

```
Browser (Next.js frontend on Cloud Run)
          │
          ▼
FastAPI backend on Cloud Run ──▶ Gemini API (google-generativeai)
          │
          └─▶ Secret Manager (Gemini API key)
```

- `frontend/`: Next.js 14 + Tailwind UI, fetched from `NEXT_PUBLIC_API_BASE_URL`.
- `backend/`: FastAPI service exposing `/health` and `/generate`, with prompt templating and Gemini client wrapper.
- `infra/terraform/`: Terraform modules for Artifact Registry, Cloud Run services, and secrets.
- `docs/`: Scenario brief, architecture notes, and (soon) deployment diagram plus submission artifacts.

## Tech Stack

- **Runtime:** Google Cloud Run (2 services: frontend + backend)
- **AI:** Google Gemini via `google-generativeai` SDK
- **Backend:** Python 3.12, FastAPI, Pydantic
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Infrastructure:** Docker, Artifact Registry, Secret Manager, Terraform (optional)
- **Tooling:** `uvicorn`, `react-hook-form`, `python-dotenv`

## Local Development

1. **Backend**
   ```bash
   cd backend
   python -m venv .venv && source .venv/bin/activate
   pip install -r requirements.txt
   cp .env.sample .env # add GEMINI_API_KEY or GOOGLE_APPLICATION_CREDENTIALS
   uvicorn app.main:app --reload
   ```
2. **Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.local.example .env.local # set NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
   npm run dev
   ```
3. Navigate to http://localhost:3000 and submit a sample scenario.

## Deployment Workflow

1. Build and push Docker images targeting `linux/amd64` with `docker buildx`.
2. Store secrets in Secret Manager (e.g., `rapid-impact-gemini-api-key`).
3. Deploy backend:
   ```bash
   gcloud run deploy rapid-impact-backend \
     --image ${BACKEND_IMAGE} \
     --region ${REGION} \
     --allow-unauthenticated \
     --set-env-vars="GEMINI_MODEL=gemini-pro-latest" \
     --set-secrets="GEMINI_API_KEY=rapid-impact-gemini-api-key:latest"
   ```
4. Deploy frontend:
   ```bash
   gcloud run deploy rapid-impact-frontend \
     --image ${FRONTEND_IMAGE} \
     --region ${REGION} \
     --allow-unauthenticated \
     --set-env-vars="NEXT_PUBLIC_API_BASE_URL=https://rapid-impact-backend-<project>.run.app"
   ```
5. Update the README with the live URLs (done).

## Submission Checklist Status

- [x] Cloud Run backend (FastAPI + Gemini)
- [x] Cloud Run frontend (Next.js UI)
- [x] AI Studio prompt share link
- [x] Architecture diagram export (`docs/architecture.png`)
- [x] Demo video (<3 minutes)
- [x] Comprehensive write-up (Devpost submission form)
- [x] Optional blog & social posts for bonus points

## License & Credit

Created for the Google Cloud Run Hackathon to highlight how AI-assisted storytelling can accelerate nonprofit impact reporting.

