import os
import json
import streamlit as st
from groq import Groq

# API key secure setup
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def solve_physics_question(question):
    # Prompt mein double-backslash force kiya hai taaki LaTeX render ho
    prompt = f"""
    You are a professional JEE Physics Expert.
    1. Use Knowledge Base: {json.dumps(get_context_from_db())}.
    2. FORMATTING RULES (CRITICAL): 
       - Use double backslashes for all LaTeX (e.g., \\frac, \\theta, \\lambda, \\Delta).
       - Wrap inline math in $...$ and block equations in $$...$$.
       - NEVER use single slashes '/' for math, always use \\frac{{a}}{{b}}.
    3. Structure: Step-by-step logic, Formula citing, Final Result.
    
    Question: {question}
    """
    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.3-70b-versatile",
    )
    return chat_completion.choices[0].message.content

def get_context_from_db():
    try:
        with open('physics_db.json', 'r') as f:
            return json.load(f)
    except:
        return {}

# UI
st.title("🚀 Acurithm: High Precision Engine")
user_input = st.text_input("JEE Advanced Level Physics ka sawal:")

if st.button("Solve"):
    if user_input:
        with st.spinner("Calculating precision..."):
            answer = solve_physics_question(user_input)
            st.markdown(answer) 
    else:
        st.warning("Please enter a question!")