# Infrastructure

Infrastructure-as-Code for Rapid Impact Partner Assistant using Terraform.

## Planned Resources

- Artifact Registry repository for backend/frontend images
- Cloud Run service for backend API
- Optional Cloud Run service or static hosting bucket for frontend
- Service accounts with least-privilege IAM bindings
- Secret Manager entries for `GEMINI_API_KEY`
- Cloud Logging/Monitoring configuration
- (Optional) Firestore or Cloud Storage for generated content history

## Usage (to be implemented)

1. Set environment variables:
   ```
   export TF_VAR_project_id=your-project
   export TF_VAR_region=us-central1
   ```
2. Initialize and apply:
   ```bash
   terraform init
   terraform plan
   terraform apply
   ```

## TODO

- [ ] Scaffold Terraform modules and variables.
- [ ] Add backend Cloud Run deployment configuration.
- [ ] Integrate Secret Manager for Gemini API key.
- [ ] Document CI/CD pipeline steps.

