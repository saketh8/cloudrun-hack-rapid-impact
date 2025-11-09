# Deployment Guide

This guide walks through building and deploying the Rapid Impact Partner Assistant to Google Cloud Run.

## Prerequisites

- Google Cloud project with billing enabled
- `gcloud` CLI (>= 463) and Docker installed locally
- Authenticated with `gcloud auth login`
- Project set: `gcloud config set project YOUR_PROJECT_ID`
- Enabled services (run once per project):
  ```bash
  gcloud services enable run.googleapis.com artifactregistry.googleapis.com secretmanager.googleapis.com
  ```
- Backend secrets handy (e.g. `GEMINI_API_KEY`, `GEMINI_MODEL`)

## 1. Build and Test the Backend Container

From the repository root:

```bash
cd backend
cp .env.sample .env # ensure the file exists with your local values

# Build the image
cd ..
docker build -t rapid-impact-backend ./backend

# Run it locally (optional, for validation)
docker run --rm -p 8000:8000 --env-file backend/.env rapid-impact-backend

# Hit the health check
curl http://127.0.0.1:8000/health
```

If the container builds and responds, you are ready to push.

## 2. Push to Artifact Registry

Set a few helper variables (adjust `REGION`, `REPO`, `SERVICE` as needed):

```bash
export REGION="us-central1"
export SERVICE="rapid-impact-backend"
export REPO="impact-services"
export IMAGE="$REGION-docker.pkg.dev/$GOOGLE_CLOUD_PROJECT/$REPO/$SERVICE:$(git rev-parse --short HEAD)"
```

Create the Artifact Registry repository if it does not exist:

```bash
gcloud artifacts repositories create "$REPO" \
  --repository-format=Docker \
  --location="$REGION" \
  --description="Images for Rapid Impact Partner Assistant"
```

Configure Docker to authenticate with Artifact Registry:

```bash
gcloud auth configure-docker "$REGION-docker.pkg.dev"
```

Tag and push the image:

```bash
docker tag rapid-impact-backend "$IMAGE"
docker push "$IMAGE"
```

## 3. Manage Secrets in Secret Manager

Create secrets for production values, for example:

```bash
gcloud secrets create rapid-impact-gemini-api-key --replication-policy=automatic
printf "%s" "$GEMINI_API_KEY" | gcloud secrets versions add rapid-impact-gemini-api-key --data-file=-

# Repeat for other secrets as needed
```

## 4. Deploy to Cloud Run

Deploy the backend container, binding secrets and configuration:

```bash
gcloud run deploy "$SERVICE" \
  --image "$IMAGE" \
  --region "$REGION" \
  --allow-unauthenticated \
  --set-env-vars="GEMINI_MODEL=gemini-1.5-pro" \
  --set-secrets="GEMINI_API_KEY=rapid-impact-gemini-api-key:latest"
```

Add additional `--set-env-vars` or `--set-secrets` flags to suit your environment.

Verify the service:

```bash
SERVICE_URL=$(gcloud run services describe "$SERVICE" --region "$REGION" --format='value(status.url)')
curl "$SERVICE_URL/health"
```

## 5. Frontend Deployment

1. Decide on a hosting target (Cloud Run, Firebase Hosting, Vercel, etc.).
2. Set `NEXT_PUBLIC_API_BASE_URL` to the Cloud Run backend URL.
3. For Cloud Run deployment:
   - Create a Dockerfile (similar to the backend) that runs `npm ci`, `npm run build`, and `npm run start`.
   - Build, push, and deploy just as you did for the backend.

## 6. Terraform (Optional)

The `infra/terraform` directory contains starter configuration for managed deployments. To use it:

```bash
cd infra/terraform
terraform init
terraform plan -var="project_id=$GOOGLE_CLOUD_PROJECT" -var="region=$REGION"
terraform apply
```

Run Terraform locally (not in restricted environments) and ensure the `variables.tf` values match your project.

## 7. Post-Deployment

- Test `/generate` with a realistic payload to confirm secrets are wired.
- Update documentation with the live URL and any team-specific instructions.
- Consider adding Cloud Build triggers for CI/CD once the manual process is stable.
