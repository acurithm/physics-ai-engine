import os
from groq import Groq

# Groq Client Setup
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def solve_physics_question(question):
    """
    Analyzes question via AI and returns precise solution using 
    the latest llama-3.3-70b-versatile model.
    """
    prompt = f"""
    You are a professional Physics tutor for JEE Advanced. 
    Analyze the user's question: "{question}".
    1. Identify the physics concept and formula required.
    2. List all known variables with SI units.
    3. Perform the calculation with 100% mathematical accuracy.
    4. Provide the final answer with correct units.
    
    If the question is a calculation, show the step-by-step math.
    """
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a precise, logical physics expert."},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.3-70b-versatile",
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        return f"Error: {str(e)}"
