# Architecture Blueprint

> Version 0.1 – subject to refinement during implementation.

## Components

- **Backend (`backend/`)**
  - FastAPI app with `/generate` endpoint.
  - Uses Google Gemini via `google-genai` client.
  - Optional Firestore/Cloud Storage logging.
  - Built and deployed to Cloud Run (container).

- **Frontend (`frontend/`)**
  - Next.js (or lightweight React) UI.
  - Calls backend REST endpoint; hosted via Cloud Run or static hosting.
  - Provides fields for event details and displays generated outputs.

- **Infrastructure (`infra/`)**
  - Terraform modules for:
    - Cloud Run service
    - Service account + IAM bindings
    - Secret Manager entry for `GEMINI_API_KEY`
    - (Optional) Firestore native mode + collection creation

## Data Flow

1. User submits event details via frontend.
2. Frontend POSTs to `/generate`.
3. Backend crafts prompt and calls Gemini.
4. Gemini response parsed into structured JSON.
5. Backend returns donor copy, social caption, internal checklist.
6. Optional: Persist results to Firestore for audit/analytics.

## Security & Config

- Secrets stored in Secret Manager, injected at deploy time.
- CORS configured for frontend domain.
- Logging via Cloud Logging; error tracking with Error Reporting.

## Deployment Strategy

- Local dev via `uvicorn` and `next dev`.
- Container builds pushed to Artifact Registry.
- Cloud Run service updated via `gcloud run deploy` or Cloud Build pipeline.
- Terraform manages infrastructure for reproducibility.

## Next Steps

- Finalize prompt templates and environment structure.
- Choose UI framework and styling approach.
- Flesh out Terraform modules and CI/CD pipeline.

