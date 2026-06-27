import os
import PyPDF2
import chromadb
from chromadb.utils import embedding_functions

# 1. Tumhara exact path jo tumne diya hai
BASE_DIR = r"C:\Users\Raush\OneDrive\Documents\JEE_Project"

# Iske andar hum database ka folder banayenge
DB_DIR = os.path.join(BASE_DIR, "Vector_Database")

print(f"📁 Project Directory: {BASE_DIR}")
print(f"🗄️ Database Directory: {DB_DIR}")

# 2. Local ChromaDB Persistent Client Setup
chroma_client = chromadb.PersistentClient(path=DB_DIR)

# Local aur Free Embedding model (Internet ki zaroorat nahi hai isme)
sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-MiniLM-L6-v2"
)

# Collection initialize karein
collection = chroma_client.get_or_create_collection(
    name="brahmastra_jee_v1", 
    embedding_function=sentence_transformer_ef
)

def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        with open(pdf_path, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text
    except Exception as e:
        print(f"⚠️ Error reading {pdf_path}: {e}")
    return text

def chunk_text(text, chunk_size=700, chunk_overlap=120):
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size - chunk_overlap):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)
    return chunks

def scan_and_ingest():
    if not os.path.exists(BASE_DIR):
        print("❌ Error: Diya gaya path system mein nahi mila! Ek baar path verify karo.")
        return

    print("\n🚀 Brahmastra Ingestion Engine Started...")
    doc_id_counter = 0

    # Poore folder tree ko scan karega (Dono NCERT aur PYQ folders ke liye)
    for root, dirs, files in os.walk(BASE_DIR):
        # Database folder ko scan nahi karna hai, skip karo
        if "Vector_Database" in root:
            continue
            
        for file in files:
            if file.lower().endswith('.pdf'):
                pdf_path = os.path.join(root, file)
                
                # Smaart Category check (Folder name se pehchanega)
                category = "General"
                if "Theory_NCERT" in root:
                    category = "NCERT_Theory"
                elif "2019" in root or "PYQs" in root:
                    category = "PYQ_2019"
                
                print(f"📖 Processing [{category}]: {file}")
                
                raw_text = extract_text_from_pdf(pdf_path)
                chunks = chunk_text(raw_text)
                
                # Vectors ko ChromaDB mein daalna
                for i, chunk in enumerate(chunks):
                    doc_id_counter += 1
                    collection.add(
                        documents=[chunk],
                        metadatas={
                            "source_file": file,
                            "category": category,
                            "folder_path": root
                        },
                        ids=[f"doc_{doc_id_counter}"]
                    )

    print(f"\n✅ Brahmastra Super Success! Total {doc_id_counter} data chunks local memory mein lock ho gaye hain.")

if __name__ == "__main__":
    scan_and_ingest()