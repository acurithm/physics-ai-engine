import streamlit as st
from main import solve_physics_question # Naya function import karo

st.title("🚀 Acurithm: High Precision Engine")
user_input = st.text_input("Physics ka sawal:")

if st.button("Solve"):
    if user_input:
        with st.spinner('Solving with high precision...'):
            # Naye function ko call karo
            result = solve_physics_question(user_input)
            st.write(result)
    else:
        st.warning("Please enter a question!")
