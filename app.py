import streamlit as st
from main import solve_physics_question

# Professional Header
st.set_page_config(page_title="Acurithm Physics Engine", page_icon="🚀")
st.title("🚀 Acurithm: High Precision Engine")
st.markdown("---")

user_input = st.text_input("JEE Advanced Level Physics ka sawal:")

if st.button("Solve"):
    if user_input:
        with st.spinner('Calculating with precision...'):
            result = solve_physics_question(user_input)
            
            # Professionally formatted output
            st.subheader("Solution:")
            with st.expander("Dekhein step-by-step analysis"):
                st.markdown(result)
            
            st.success("Analysis complete!")
    else:
        st.warning("Please enter a question!")
