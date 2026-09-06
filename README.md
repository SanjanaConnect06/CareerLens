# CareerLens

### AI-Powered Career Guidance & Interview Preparation Platform

CareerLens AI is an AI-powered career guidance platform designed to help students and job seekers understand their career readiness, improve their resumes, identify skill gaps, prepare for interviews, and build personalized career roadmaps.

The platform brings multiple career-development tools into a single dashboard, using Google Gemini AI to provide personalized recommendations and feedback.

## ✨ Key Features

### 📄 AI Resume Analyzer
- Upload and analyze resumes
- Extract resume content automatically
- Generate ATS compatibility scores
- Identify resume strengths and weaknesses
- Detect missing or weak areas
- Provide personalized improvement suggestions
- Maintain resume analysis history

### 🎯 Skill Gap Analysis
- Analyze the user's existing skills
- Compare skills against career requirements
- Identify missing skills
- Highlight areas that need improvement
- Provide personalized skill recommendations

### 🗺️ Personalized Career Roadmaps
- Generate AI-powered career roadmaps
- Break career preparation into structured phases
- Provide learning and development steps
- Track progress through roadmap phases
- Save and manage multiple roadmaps

### 🎤 AI Interview Coach
- Generate AI-powered interview questions
- Conduct interviews one question at a time
- Voice-based interaction using browser speech recognition
- Generate adaptive follow-up questions
- Evaluate interview answers
- Provide personalized feedback
- Generate a final interview performance report

### 🎓 Career Goal Management
- Set a personalized career goal
- Receive career-focused recommendations
- Update career goals whenever required
- Use career goals to personalize the dashboard experience

### 📊 Personalized Dashboard
- Resume analysis statistics
- ATS performance tracking
- Skill-gap results
- Career roadmap progress
- Interview performance
- Centralized career development experience

---

# 🛠️ Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- JavaScript
- Web Speech API

## Backend

- Python
- Flask
- Flask-CORS
- Gunicorn

## AI & Document Processing

- Google Gemini API
- Google GenAI SDK
- PyMuPDF

## Database & Authentication

- SQLite
- bcrypt
- JWT Authentication

## Deployment

- GitHub
- Vercel
- Render

---

# 🏗️ System Architecture

```text
                         ┌─────────────────────┐
                         │       User          │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   React Frontend    │
                         │       Vite          │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Flask Backend     │
                         │     REST APIs       │
                         └──────────┬──────────┘
                                    │
                ┌───────────────────┼───────────────────┐
                │                   │                   │
                ▼                   ▼                   ▼
        ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
        │ Resume       │    │ Skill Gap    │    │ Interview    │
        │ Analysis     │    │ Analysis     │    │ Coach        │
        └──────┬───────┘    └──────┬───────┘    └──────┬───────┘
               │                   │                   │
               └───────────────────┼───────────────────┘
                                   ▼
                         ┌─────────────────────┐
                         │   Google Gemini AI  │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ Personalized Career │
                         │     Insights        │
                         └─────────────────────┘
