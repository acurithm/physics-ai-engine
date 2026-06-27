import PyPDF2
import json
import os  # <-- Yeh zaroori hai!
from groq import Groq

# API key environment variable se uthaye
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def extract_to_db(pdf_path):
    text = ""
    # Path check karo ki file exist karti hai ya nahi
    if not os.path.exists(pdf_path):
        print(f"Error: PDF file '{pdf_path}' nahi mili!")
        return

    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text.encode('ascii', 'ignore').decode('ascii')

    print("Cleaning syllabus text... extracting now.")

    prompt = f"""
    Convert this JEE syllabus text into a strict JSON format. 
    Only return valid JSON. No Markdown code blocks.
    Format: {{"physics": {{"chapter_name": {{"concept": "...", "formula": "...", "source": "NTA JEE Syllabus"}}}}}}
    Text: {text[:3000]}
    """
    
    response = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.3-70b-versatile"
    )
    
    extracted_json = response.choices[0].message.content
    with open('physics_db.json', 'w') as f:
        f.write(extracted_json)
    
    print("Brahmastra Knowledge Base updated successfully!")

# Script run karo
extract_to_db('data/jee_master_syllabus.pdf')       