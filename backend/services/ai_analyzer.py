import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def analyze_resume(resume_text):

    prompt = f"""
You are CareerLens AI, an expert ATS resume evaluator and senior recruiter
with extensive experience reviewing resumes for internships, entry-level
roles, and professional positions.

Analyze the resume carefully and provide a realistic ATS compatibility
assessment.

IMPORTANT RULES:

1. Do NOT automatically give a high score.
2. Scores must reflect the actual quality of the resume.
3. Do NOT invent information that is not present in the resume.
4. Identify specific problems instead of giving generic advice.
5. Focus on ATS readability, relevance, clarity, skills, projects,
   experience, education, and measurable achievements.
6. Consider whether the resume is suitable for automated resume parsing.
7. Look for missing or weak sections.
8. Check whether project descriptions explain what was built,
   technologies used, and measurable results.
9. Check whether experience descriptions use strong action verbs.
10. Check for vague statements such as "worked on", "helped", or
    "responsible for" when stronger wording would be appropriate.
11. Check for measurable achievements such as percentages, numbers,
    performance improvements, users, scale, or other measurable outcomes.
12. Check whether skills are clearly organized.
13. Identify unnecessary information, repetition, or keyword stuffing.
14. Check grammar and professional language.
15. Consider whether the resume is concise and suitable for a
    one-page resume when the candidate is a student or fresher.
16. Do not penalize a fresher simply because they have no full-time
    employment experience. Consider projects, internships, certifications,
    hackathons, open-source contributions, and leadership instead.
17. Missing skills should only be suggested when they are reasonably
    relevant to the skills and experience shown in the resume.
18. Give practical improvements that the candidate can actually make.

SCORING GUIDELINES:

95-100 = Exceptional ATS compatibility
85-94  = Excellent
75-84  = Good
65-74  = Average
50-64  = Needs improvement
Below 50 = Weak

Do not force the score into any particular range.

Evaluate these areas:

- ATS-friendly structure
- Resume sections
- Relevant skills
- Projects
- Experience / internships
- Education
- Certifications / achievements
- Action verbs
- Quantifiable impact
- Keyword relevance
- Grammar and clarity
- Overall readability

Return ONLY valid JSON.

Use exactly this structure:

{{
    "ats_score": 0,

    "strengths": [
        ""
    ],

    "weaknesses": [
        ""
    ],

    "missing_skills": [
        ""
    ],

    "improvements": [
        ""
    ],

    "summary": ""
}}

QUALITY REQUIREMENTS:

"strengths":
Mention specific things the resume does well.

"weaknesses":
Mention actual weaknesses found in the resume.

"missing_skills":
Only mention skills that would reasonably strengthen the candidate's
target profile based on the resume. Do not randomly list technologies.

"improvements":
Give specific actions the candidate should take.

"summary":
Write a short professional assessment explaining the overall resume
quality and the most important improvements.

Do not include markdown.
Do not include ```json.
Do not include text outside the JSON.

RESUME:

{resume_text}
"""

    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=prompt,
    )

    text = response.text.strip()

    # Remove markdown code fences if Gemini returns them
    if text.startswith("```json"):
        text = text.replace("```json", "").replace("```", "").strip()

    try:
        result = json.loads(text)

        # Make sure the required fields always exist
        return {
            "ats_score": result.get("ats_score", 0),
            "strengths": result.get("strengths", []),
            "weaknesses": result.get("weaknesses", []),
            "missing_skills": result.get("missing_skills", []),
            "improvements": result.get("improvements", []),
            "summary": result.get("summary", "")
        }

    except json.JSONDecodeError:

        return {
            "ats_score": 0,
            "strengths": [],
            "weaknesses": [
                "The AI response could not be parsed."
            ],
            "missing_skills": [],
            "improvements": [
                "Please try analyzing the resume again."
            ],
            "summary": text
        }