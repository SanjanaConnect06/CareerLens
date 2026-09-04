import os
import json
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def analyze_skill_gap(goal, skills):

    prompt = f"""
You are an expert career mentor and skill-gap analyst.

Analyze the user's current skills against the requirements of their target career.

Target Career:
{goal}

Current Skills:
{skills}

Calculate a realistic skill match percentage from 0 to 100.

IMPORTANT:
- "skill_match" MUST be a NUMBER.
- Do NOT write words or explanations inside skill_match.
- Example: 72
- NOT: "72%"
- NOT: "Moderate"
- NOT: "Moderate, you have a solid foundation..."
- The percentage should represent how well the user's current skills match the important skills normally required for the target career.
- Do not give an inflated score just to be encouraging.
- Consider technical skills, tools, domain knowledge, and important foundational skills.
- If important core skills are missing, reduce the score accordingly.

Return ONLY valid JSON.

{{
    "goal": "",
    "skill_match": 0,
    "current_strengths": [],
    "missing_skills": [
        {{
            "skill": "",
            "priority": "High"
        }}
    ],
    "learning_resources": [],
    "estimated_time": "",
    "action_plan": [],
    "career_tips": []
}}

Rules:
- skill_match must be an integer between 0 and 100.
- priority must be exactly one of: "High", "Medium", "Low".
- current_strengths must contain skills the user actually listed.
- missing_skills must contain important skills needed for the target career that are not present in the user's current skills.
- recommendations must be practical and realistic.
- Do not invent skills that the user already has.
"""

    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=prompt,
    )

    text = response.text.strip()

    if text.startswith("```json"):
        text = text.replace("```json", "").replace("```", "").strip()

    try:
        result = json.loads(text)

        # Make sure skill_match is numeric
        skill_match = result.get("skill_match", 0)

        if isinstance(skill_match, str):
            skill_match = skill_match.replace("%", "").strip()

            try:
                skill_match = int(skill_match)
            except ValueError:
                skill_match = 0

        result["skill_match"] = max(0, min(100, int(skill_match)))

        return result

    except (json.JSONDecodeError, ValueError, TypeError):
        return {
            "goal": goal,
            "skill_match": 0,
            "current_strengths": [],
            "missing_skills": [],
            "learning_resources": [],
            "estimated_time": "",
            "action_plan": [],
            "career_tips": []
        }