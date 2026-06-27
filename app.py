import streamlit as st
import os
from main import get_ai_order, execute_tool

st.title("🚀 Acurithm: Physics Engine")

question = st.text_input("Physics ka sawal:")
if st.button("Solve"):
    order = get_ai_order(question)
    result = execute_tool(order['tool'], order['params'])
    st.success(result)