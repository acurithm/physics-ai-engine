import PyPDF2
import json
import os
from groq import Groq

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def extract_to_db(pdf_path):
    if not os.path.exists(pdf_path):
        print(f"Error: {pdf_path} nahi mila!")
        return

    text = ""
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text.encode('ascii', 'ignore').decode('ascii')

    prompt = f"""
    Convert this JEE syllabus into strict JSON.
    FORMATTING RULES (CRITICAL):
    - Use double backslashes for LaTeX (e.g., \\frac, \\theta, \\lambda).
    - Format: {{"physics": {{"chapter_name": {{"concept": "...", "formula": "...", "source": "NTA"}}}}}}
    Text: {text[:3000]}
    """
    
    response = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.3-70b-versatile"
    )
    
    with open('physics_db.json', 'w') as f:
        f.write(response.choices[0].message.content)
    print("Brahmastra Knowledge Base updated!")

extract_to_db('data/jee_master_syllabus.pdf')