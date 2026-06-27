import os
import uvicorn
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

# CORS configuration taaki tumhari frontend request block na ho
app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"], 
    allow_methods=["*"], 
    allow_headers=["*"]
)

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class ChatRequest(BaseModel):   
    question: str

@app.post("/stream-ask")
async def stream_ask(req: ChatRequest):
    # JEE Coach Persona Implementation
    system_prompt = """You are an expert JEE Physics, Chemistry, and Mathematics coach named Acurithm. 
    Your instructions:
    1. Be concise, accurate, and professional.
    2. Focus strictly on NCERT concepts and JEE Main/Advanced syllabus.
    3. Use LaTeX (e.g., $E=mc^2$) for all mathematical formulas and scientific notations.
    4. Provide step-by-step logic/derivation.
    5. Always conclude with a one-sentence encouraging remark or a related practice question.
    """

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": req.question}
        ],
        stream=True
    )

    def generate():
        for chunk in completion:
            content = chunk.choices[0].delta.content
            if content:
                yield content

    return StreamingResponse(generate(), media_type="text/event-stream")

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)