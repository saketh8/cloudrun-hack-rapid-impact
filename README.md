# Rapid Impact Partner Assistant

Rapid Impact Partner Assistant helps small nonprofits and local agencies turn quick field notes into polished donor communications, social posts, and internal action items in seconds. Powered by Google Gemini and deployed on Cloud Run, the app showcases how AI can accelerate community impact storytelling without heavy infrastructure.

## Project Vision

- **Problem**: Small teams often struggle to communicate outcomes promptly after community events.
- **Solution**: Provide a single page tool that accepts event details and instantly generates three ready-to-use assets:
  1. Donor newsletter paragraph
  2. Social media caption
  3. Internal follow-up checklist
- **Outcome**: Faster reporting, more engaged supporters, and clearer next steps for staff.

## Architecture Overview

- `backend/` – FastAPI service exposing a `/generate` endpoint that calls Gemini.
- `frontend/` – Lightweight Next.js (or vanilla JS) web UI hosted via Cloud Run or Cloud Storage.
- `infra/` – Terraform for Cloud Run service, service account, Secret Manager, and optional Firestore bucket for audit logs.
- `docs/` – Product brief, architecture diagram, runbook, and demo script.

## Judging Criteria Mapping

- **Technical Implementation**: Clean FastAPI service, structured prompt templates, Cloud Run deployment, optional Firestore logging, CI/CD pipeline.
- **Demo & Presentation**: Story-driven walkthrough (nonprofit scenario), architecture diagram, README quickstart, and 3-minute demo video.
- **Innovation & Creativity**: Focused AI assistant tailored to real-world community organizations, showing how AI amplifies human effort.

## Getting Started

1. Clone repo and create a virtual environment in `backend/`.
2. Set `GEMINI_API_KEY` (Secret Manager or `.env` for local).
3. Run the FastAPI dev server and Next.js frontend locally (`backend/README.md`, `frontend/README.md` contain detailed instructions).
4. Use Terraform module in `infra/` to provision Cloud Run service and Secret Manager secret.

## Roadmap

- [ ] Implement `/generate` endpoint and prompt templates.
- [ ] Build responsive web UI with sections for inputs and generated outputs.
- [ ] Add Firestore logging (optional) and download/share options.
- [ ] Wire GitHub Actions or Cloud Build for continuous deployment.
- [ ] Create demo video, blog post, and social proof assets for submission.

---

Created for the Google Cloud Run Hackathon. Crafted to highlight AI + serverless agility for the judging panel.***

