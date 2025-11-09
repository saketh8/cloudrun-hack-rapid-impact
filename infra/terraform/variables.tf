variable "project_id" {
  description = "Google Cloud project ID"
  type        = string
}

variable "region" {
  description = "Default region for Cloud Run and related services"
  type        = string
  default     = "us-central1"
}

variable "artifact_registry_location" {
  description = "Location for container registry"
  type        = string
  default     = "us-central1"
}

variable "backend_image_name" {
  description = "Container image name for the backend service"
  type        = string
  default     = "rapid-impact-backend"
}

