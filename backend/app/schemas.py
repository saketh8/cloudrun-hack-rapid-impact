from pydantic import BaseModel, Field


class GenerateRequest(BaseModel):
  event_title: str = Field(..., description="Headline summary of the activity")
  event_date: str = Field(..., description="Date or date range of the event")
  audience: str = Field(..., description="Target donor segment or stakeholders")
  volunteers: int | None = None
  constituents_served: int | None = None
  highlights: str = Field(..., description="Short description of outcomes or stories")


class GenerateResponse(BaseModel):
  donor_update: str
  social_caption: str
  follow_up_checklist: list[str]

