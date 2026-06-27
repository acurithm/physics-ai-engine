from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import openai
import os
from dotenv import load_dotenv

# .env file se keys load karo
load_dotenv()

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

# OpenAI Client Setup - Ab ye .env ya environment variables se key uthayega
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class Query(BaseModel):
    question: str

SYSTEM_PROMPT = """
You are an elite JEE Mentor. Your goal is to help students crack JEE Main and Advanced.
- Always provide step-by-step solutions for Physics, Chemistry, and Maths.
- Use LaTeX formatting for all mathematical equations.
- Whenever possible, provide a 'Shortcut Tip' or 'Important NCERT Reference' for the concept.
- If the user asks for a doubt, explain the concept simply first, then provide the solution.
- Maintain a highly encouraging and professional tone.
"""

def generate_ai_response(question: str):
    # Error handling ke liye try-except block zaroori hai
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": question}
            ],
            stream=True,
        )
        
        for chunk in response:
            if chunk.choices[0].delta.content is not None:
                yield chunk.choices[0].delta.content
    except Exception as e:
        yield f"Error: {str(e)}"

@app.post("/stream-ask")
async def ask(query: Query):
    return StreamingResponse(
        generate_ai_response(query.question), 
        media_type="text/event-stream"
    )

# Render/Local ke liye test endpoint
@app.get("/")
def health_check():
    return {"status": "Acurithm Backend is Online!"}