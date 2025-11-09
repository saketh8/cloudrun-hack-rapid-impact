import json
import logging
import os
import re
from typing import Any, Dict, Optional

import google.generativeai as genai
from google.api_core import exceptions as google_exceptions
from google.auth.transport.requests import Request
from google.oauth2 import service_account

logger = logging.getLogger(__name__)

SCOPES = ["https://www.googleapis.com/auth/generative-language"]
DEFAULT_MODEL = "gemini-2.5-pro"


class GeminiClient:
  def __init__(self, api_key: str | None = None, model: str | None = None) -> None:
    self.api_key = api_key or os.getenv("GEMINI_API_KEY")
    self.model = model or os.getenv("GEMINI_MODEL", DEFAULT_MODEL)
    self.credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    self.credentials: Optional[service_account.Credentials] = None
    self._initialised = False

    self._initialise_client()

  def _initialise_client(self) -> None:
    try:
      if self.api_key:
        genai.configure(api_key=self.api_key, transport="rest")
        self.client = genai.GenerativeModel(model_name=self.model)
        self._initialised = True
        return

      if self.credentials_path and os.path.exists(self.credentials_path):
        self.credentials = service_account.Credentials.from_service_account_file(
            self.credentials_path,
            scopes=SCOPES,
        )
        self._configure_with_credentials()
        self.client = genai.GenerativeModel(model_name=self.model)
        self._initialised = True
        return

      logger.warning(
          "No GEMINI_API_KEY or GOOGLE_APPLICATION_CREDENTIALS provided; responses will be stubbed."
      )
      self.client = None
    except Exception as exc:  # pragma: no cover
      logger.exception("Failed to initialise Gemini client")
      self.client = None
      self._initialised = False

  def _configure_with_credentials(self) -> None:
    if not self.credentials:
      return
    self.credentials.refresh(Request())
    genai.configure(access_token=self.credentials.token, transport="rest")

  def _fallback_model(self) -> bool:
    """Attempt to fall back to the default model if the configured one fails."""
    if self.model == DEFAULT_MODEL:
      return False
    logger.info("Falling back from model %s to %s", self.model, DEFAULT_MODEL)
    self.model = DEFAULT_MODEL
    self._initialise_client()
    return self._initialised

  def _parse_json(self, text: str) -> Dict[str, Any]:
    candidates = []
    fence_match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, flags=re.DOTALL)
    if fence_match:
      candidates.append(fence_match.group(1))
    candidates.append(text)

    for candidate in candidates:
      try:
        return json.loads(candidate)
      except json.JSONDecodeError:
        continue
    raise json.JSONDecodeError("Could not parse JSON", text, 0)

  def generate(self, prompt: str) -> Dict[str, Any]:
    if not self.client:
      return {
          "donor_update": "Gemini credentials not configured.",
          "social_caption": "Provide GEMINI_API_KEY or service account credentials.",
          "follow_up_checklist": [
              "Set GEMINI_API_KEY or GOOGLE_APPLICATION_CREDENTIALS",
              "Restart the backend service",
              "Retry generation",
          ],
      }

    try:
      if self.credentials and not self.api_key:
        self._configure_with_credentials()
      response = self.client.generate_content(prompt)
    except google_exceptions.NotFound:
      if self._fallback_model():
        return self.generate(prompt)
      logger.error(
          "Requested model '%s' not available. Tried fallback '%s' without success.",
          self.model,
          DEFAULT_MODEL,
      )
      return {"error": f"Model '{self.model}' not available in this project."}
    except google_exceptions.Unauthorized as exc:
      logger.error("Authentication error calling Gemini: %s", exc)
      return {"error": "Authentication with Gemini failed. Check credentials."}
    except Exception as exc:  # pragma: no cover
      logger.exception("Gemini generation failed")
      return {"error": str(exc)}

    if not response or not getattr(response, "text", None):
      return {"error": "No response from Gemini"}

    text = response.text.strip()

    try:
      return self._parse_json(text)
    except json.JSONDecodeError:
      logger.warning("Gemini response not valid JSON; returning raw text.")
      return {"raw_output": text}
