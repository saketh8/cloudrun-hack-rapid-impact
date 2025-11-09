output "artifact_registry_repo" {
  description = "Artifact Registry repository name"
  value       = google_artifact_registry_repository.backend.name
}

output "backend_service_uri" {
  description = "Cloud Run service URI"
  value       = google_cloud_run_v2_service.backend.uri
}

output "backend_service_account" {
  description = "Service account email for backend"
  value       = google_service_account.backend.email
}

