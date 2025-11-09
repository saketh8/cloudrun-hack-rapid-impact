# Artifact Registry for backend image
resource "google_artifact_registry_repository" "backend" {
  location      = var.artifact_registry_location
  repository_id = "rapid-impact-artifacts"
  format        = "DOCKER"
  description   = "Images for Rapid Impact Partner Assistant"
}

# Service account for Cloud Run backend
resource "google_service_account" "backend" {
  account_id   = "rapid-impact-backend-sa"
  display_name = "Rapid Impact backend service account"
}

# Placeholder Cloud Run service (image to be supplied after first build)
resource "google_cloud_run_v2_service" "backend" {
  name     = "rapid-impact-backend"
  location = var.region

  template {
    containers {
      image = "us-docker.pkg.dev/${var.project_id}/rapid-impact-artifacts/${var.backend_image_name}:latest"
      env {
        name  = "GEMINI_MODEL"
        value = "gemini-2.5-flash-light"
      }
      env {
        name = "GEMINI_API_KEY"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.gemini_api_key.secret_id
            version = "latest"
          }
        }
      }
    }
    service_account = google_service_account.backend.email
  }

  depends_on = [google_secret_manager_secret_version.gemini_api_key]
}

# Secret Manager entry for Gemini API key
resource "google_secret_manager_secret" "gemini_api_key" {
  secret_id = "rapid-impact-gemini-api-key"

  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret_version" "gemini_api_key" {
  secret      = google_secret_manager_secret.gemini_api_key.id
  secret_data = "SET_ME"
}

