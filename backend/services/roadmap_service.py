import os
import json
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def generate_roadmap(goal, level, industry):

    prompt = f"""
You are CareerLens AI, an expert career mentor with over 20 years of experience in career guidance, recruitment, and industry hiring.

Your job is to create a practical, realistic, and personalized career roadmap.

User Details:

Career Goal: {goal}

Current Level: {level}

Preferred Industry: {industry}

Guidelines:

- The roadmap must be realistic and follow current industry standards.
- The roadmap should work for ANY profession.
- Do NOT give generic motivational advice.
- Give actionable steps.
- Mention only valuable certifications.
- Recommend practical projects or real-world experience.
- Mention realistic salary ranges for India.
- Organize everything in a logical learning order.
- If certifications or projects are not applicable, return an empty list.
- Return ONLY valid JSON.
- Do NOT include markdown.
- Do NOT include explanations outside the JSON.

Return JSON in exactly this format:

{{
    "goal": "",
    "overview": "",
    "career_growth": [],
    "salary": {{
        "entry": "",
        "mid": "",
        "senior": ""
    }},
    "skills": {{
        "technical": [],
        "soft": [],
        "tools": []
    }},
    "certifications": [],
    "projects": [],
    "roadmap": [
        {{
            "phase": "",
            "duration": "",
            "topics": []
        }}
    ],
    "interview_preparation": [],
    "resources": [],
    "common_mistakes": [],
    "career_tips": []
}}
"""

    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=prompt,
    )

    text = response.text.strip()

    # Remove markdown code fences if Gemini adds them
    if text.startswith("```"):
        text = text.replace("```json", "")
        text = text.replace("```", "")
        text = text.strip()

    try:
        result = json.loads(text)

        return result

    except json.JSONDecodeError as error:
        print("ROADMAP JSON ERROR:", error)
        print("GEMINI RESPONSE:")
        print(text)

        raise ValueError(
            "Gemini returned invalid JSON for the roadmap."
        )