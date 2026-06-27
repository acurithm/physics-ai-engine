import os
import json
from groq import Groq

# GitHub Secrets se key uthayega
api_key = os.environ.get("GROQ_API_KEY")
client = Groq(api_key=api_key)

def get_context_from_db():
    try:
        with open('physics_db.json', 'r') as f:
            return json.load(f)
    except:
        return {}

def solve_physics_question(question):
    db_context = get_context_from_db()
    prompt = f"""
    You are a verified JEE Physics Engine.
    Knowledge Base: {db_context}
    Analyze: "{question}".
    1. Identify concept from Knowledge Base.
    2. Cite source.
    3. Solve with 100% accuracy.
    """
    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.3-70b-versatile",
    )
    return chat_completion.choices[0].message.content
