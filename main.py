import os
import json
from groq import Groq

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def get_context_from_db():
    # JSON file ko read karo
    try:
        with open('physics_db.json', 'r') as f:
            return json.load(f)
    except:
        return "No database found."

def solve_physics_question(question):
    db_context = get_context_from_db()
    prompt = f"""
    You are a precise JEE Physics Brahmastra engine. 
    Use the following verified knowledge: {db_context}
    
    Analyze: "{question}".
    1. Identify the concept from the knowledge base.
    2. Cite the source (Book/Page) provided in the knowledge base.
    3. Solve with 100% mathematical accuracy using provided formulas.
    """
    
    chat_completion = client.chat.completions.create(
        messages=[{"role": "system", "content": "You are a precise, logical physics expert."},
                  {"role": "user", "content": prompt}],
        model="llama-3.3-70b-versatile",
    )
    return chat_completion.choices[0].message.content
