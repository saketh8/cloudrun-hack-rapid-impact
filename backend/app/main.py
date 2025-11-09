import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv


from .schemas import GenerateRequest, GenerateResponse
from .services.gemini_client import GeminiClient
from .services.prompt_builder import build_prompt


load_dotenv()

app = FastAPI(title="Rapid Impact Partner Assistant API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
gemini_client = GeminiClient(
    api_key=os.getenv("GEMINI_API_KEY"),
    model=os.getenv("GEMINI_MODEL"),
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/generate", response_model=GenerateResponse)
async def generate_content(payload: GenerateRequest) -> GenerateResponse:
    """
    Placeholder endpoint. Will be wired to Gemini in subsequent steps.
    """
    if not payload.event_title or not payload.highlights:
        raise HTTPException(status_code=400, detail="Missing required fields.")

    prompt = build_prompt(payload)
    result = gemini_client.generate(prompt)

    donor_update = result.get("donor_update")
    social_caption = result.get("social_caption")
    follow_up = result.get("follow_up_checklist")

    if not isinstance(follow_up, list):
        follow_up = [str(follow_up)] if follow_up else []

    return GenerateResponse(
        donor_update=donor_update or "Gemini did not return donor update text.",
        social_caption=social_caption or "Gemini did not return social caption text.",
        follow_up_checklist=[str(item) for item in follow_up],
    )

