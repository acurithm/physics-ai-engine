import os
import streamlit as st
from groq import Groq
import sympy

# Initialize Groq Client
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def solve_physics_question(question):
    # 1. AI Logic: Extract variables and map to tools
    prompt = f"""
    You are a strictly accurate Physics Solver for JEE level. 
    Analyze the question: "{question}".
    1. Identify all variables (u, v, a, t, s).
    2. Convert all units to SI units (m, s, m/s, m/s^2).
    3. Output the calculation steps clearly.
    4. Ensure no guesswork. Use standard physics formulas.
    """
    
    chat_completion = client.chat.completions.create(
        messages=[{"role": "system", "content": "You are a precise physics assistant."},
                  {"role": "user", "content": prompt}],
        model="llama3-70b-8192",
    )
    return chat_completion.choices[0].message.content

# Streamlit Interface
st.title("🚀 Acurithm: High Precision Engine")
user_input = st.text_input("Physics ka sawal:")

if st.button("Solve"):
    with st.spinner('Solving with high precision...'):
        result = solve_physics_question(user_input)
        st.write(result)
