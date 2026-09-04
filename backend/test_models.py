import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

models = [
    "gemini-flash-latest",
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite",
    "gemini-2.0-flash",
]

for model in models:
    try:
        response = client.models.generate_content(
            model=model,
            contents="Reply with only the word OK."
        )
        print(f"✅ {model} works:", response.text)
    except Exception as e:
        print(f"❌ {model} failed:", e)