# Backend – FastAPI Service

## Overview

This service exposes a `/generate` endpoint that accepts event metadata and returns:

- Donor newsletter paragraph
- Social media caption
- Internal follow-up checklist

The service calls Gemini (2.5 Flash Light by default) using the official Google GenAI SDK.

## Quick Start

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Create a `.env` file with:

```
GEMINI_MODEL=gemini-2.5-flash-light
GEMINI_API_KEY=YOUR_KEY
```

## Project Structure (planned)

```
backend/
  app/
    __init__.py
    main.py
    schemas.py
    services/
      prompt_builder.py
      gemini_client.py
  tests/
    test_generate.py
  requirements.txt
```

## TODO

- [ ] Implement schemas and validation.
- [ ] Create prompt templates and Gemini client wrapper.
- [ ] Add unit tests and integration test fixtures.
- [ ] Wire logging/metrics for Cloud Run deployment.

