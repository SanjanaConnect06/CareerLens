import os
import json
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

MAX_QUESTIONS = 15


def _parse_json_response(response):
    """
    Safely extract JSON from Gemini response.
    """
    text = response.text.strip()

    if text.startswith("```json"):
        text = text[7:]

    if text.startswith("```"):
        text = text[3:]

    if text.endswith("```"):
        text = text[:-3]

    text = text.strip()

    return json.loads(text)


def generate_first_question(role, level):
    """
    Generate the first question for a live interview.
    """

    prompt = f"""
You are a senior professional interviewer conducting a realistic job interview.

Candidate Career Role:
{role}

Candidate Experience Level:
{level}

Generate the FIRST interview question.

Rules:
- Make it realistic for an actual interview.
- Match the candidate's role and experience level.
- Mix technical, behavioral, HR and problem-solving questions across the interview.
- Do not provide a model answer.
- Do not provide hints.
- Ask only ONE question.
- Return ONLY valid JSON.
- No markdown.

Return exactly:

{{
    "question": "The interview question"
}}
"""

    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=prompt,
    )

    return _parse_json_response(response)


def evaluate_answer(
    role,
    level,
    question_number,
    question,
    answer,
    previous_history
):
    """
    Evaluate the candidate's answer and generate the next adaptive question.
    """

    history_text = ""

    for item in previous_history:
        history_text += f"""
Question {item["question_number"]}:
{item["question"]}

Candidate Answer:
{item["answer"]}

Score:
{item.get("score", 0)}/10
"""

    prompt = f"""
You are a senior hiring manager conducting a realistic interview.

Candidate Role:
{role}

Experience Level:
{level}

Current Question Number:
{question_number} of {MAX_QUESTIONS}

Current Question:
{question}

Candidate's Answer:
{answer}

Previous Interview History:
{history_text}

Evaluate the candidate's current answer.

Scoring:
- score: overall answer quality from 0 to 10
- technical_knowledge: technical understanding from 0 to 10
- problem_solving: reasoning and problem solving from 0 to 10
- communication: clarity and structure from 0 to 10
- confidence: confidence demonstrated through the answer from 0 to 10

Rules:
- Be realistic and fair.
- Do not give a model answer.
- Give concise, useful feedback.
- Identify one specific strength.
- Identify one specific improvement.
- The next question must adapt to the candidate's previous answer.
- Do not repeat questions.
- The next question must be appropriate for the role.
- Mix technical, behavioral, HR and problem-solving questions naturally.
- Ask exactly ONE next question.
- Return ONLY valid JSON.
- No markdown.

Return exactly:

{{
    "score": 0,
    "technical_knowledge": 0,
    "problem_solving": 0,
    "communication": 0,
    "confidence": 0,
    "feedback": "",
    "strength": "",
    "improvement": "",
    "next_question": ""
}}
"""

    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=prompt,
    )

    return _parse_json_response(response)


def generate_final_evaluation(role, level, interview_history):
    """
    Generate the final performance report after the interview.
    """

    history_text = ""

    for item in interview_history:
        history_text += f"""
Question {item["question_number"]}:
{item["question"]}

Candidate Answer:
{item["answer"]}

Score:
{item.get("score", 0)}/10

Technical Knowledge:
{item.get("technical_knowledge", 0)}/10

Problem Solving:
{item.get("problem_solving", 0)}/10

Communication:
{item.get("communication", 0)}/10

Confidence:
{item.get("confidence", 0)}/10

Feedback:
{item.get("feedback", "")}
"""

    prompt = f"""
You are a senior hiring manager providing a final interview performance evaluation.

Candidate Role:
{role}

Experience Level:
{level}

Interview History:
{history_text}

Create a detailed but concise final performance report.

Rules:
- Evaluate the complete interview.
- Calculate realistic scores from 0 to 100.
- Consider technical knowledge, problem solving, communication and confidence.
- Identify genuine strengths.
- Identify specific weaknesses.
- Give practical improvement advice.
- Recommend topics the candidate should practice.
- Give answer-by-answer feedback.
- Do NOT provide model answers.
- Do NOT include model answers anywhere.
- Return ONLY valid JSON.
- No markdown.

Return exactly:

{{
    "overall_score": 0,
    "technical_knowledge": 0,
    "problem_solving": 0,
    "communication": 0,
    "confidence": 0,
    "summary": "",
    "strengths": [],
    "weaknesses": [],
    "recommended_topics": [],
    "answer_feedback": [
        {{
            "question_number": 1,
            "score": 0,
            "feedback": ""
        }}
    ]
}}
"""

    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=prompt,
    )

    return _parse_json_response(response)