import os
import json
import streamlit as st
from groq import Groq

# API key secure setup
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def solve_physics_question(question):
    prompt = f"""
    You are a professional JEE Physics Expert.
    1. Use Knowledge Base: {json.dumps(get_context_from_db())}.
    2. FORMATTING RULES (CRITICAL): 
       - Use double backslashes for all LaTeX (e.g., \\frac, \\theta, \\lambda, \\Delta).
       - Wrap inline math in $...$ and block equations in $$...$$.
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

# UI - Title and Input
st.title("🚀 Acurithm: High Precision Engine")
user_input = st.text_input("JEE Advanced Level Physics ka sawal:", key="physics_unique_key")

# Feedback state initialize karo
if 'feedback_given' not in st.session_state:
    st.session_state.feedback_given = False

if st.button("Solve"):
    if user_input:
        with st.spinner("Calculating precision..."):
            answer = solve_physics_question(user_input)
            st.markdown(answer)
            # Answer milne ke baad flag set karo
            st.session_state.feedback_given = True
            st.session_state.last_answer = answer
    else:
        st.warning("Please enter a question!")

# Feedback Section
if st.session_state.feedback_given:
    st.write("---")
    st.write("💡 **Kya ye jawab helpful tha?**")
    col1, col2 = st.columns(2)
    
    if col1.button("👍 Haan"):
        st.success("Feedback recorded! Engine upgrade ho raha hai.")
    
    if col2.button("👎 Nahi"):
        st.warning("Sorry! Isse improve karne ke liye data update karna padega.")