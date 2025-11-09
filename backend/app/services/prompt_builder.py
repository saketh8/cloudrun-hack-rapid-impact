from textwrap import dedent
from ..schemas import GenerateRequest


def build_prompt(request: GenerateRequest) -> str:
  """
  Constructs a single prompt string for Gemini using the incoming request.
  Later we may refactor into separate prompts per asset.
  """
  volunteers = request.volunteers or "N/A"
  served = request.constituents_served or "N/A"

  instructions = dedent(
      """
      You are assisting a nonprofit communications specialist. Using the supplied event context,
      generate the following outputs and return strictly valid JSON with exactly these keys:

        donor_update (string): 4-6 sentence narrative thanking supporters and summarizing outcomes.
        social_caption (string): concise social media caption with impact metrics and a call-to-action.
        follow_up_checklist (array of strings): 3-5 actionable next steps for staff or volunteers.

      Requirements:
        - Respond with JSON only (no code fences, explanations, or additional keys).
        - Escape any embedded quotation marks properly.
        - Keep tone empathetic, community-driven, and donor-friendly.
      """
  ).strip()

  context = dedent(
      f"""
      Event Title: {request.event_title}
      Event Date: {request.event_date}
      Audience: {request.audience}
      Volunteers: {volunteers}
      People Served: {served}
      Highlights: {request.highlights}
      """
  ).strip()

  return f"{instructions}\n\n{context}"

