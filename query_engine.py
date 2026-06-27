import os
import chromadb
from chromadb.utils import embedding_functions
from groq import Groq
from dotenv import load_dotenv

# Environment variables load karein (.env file se API Key uthane ke liye)
load_dotenv()

# 1. Database and API Setup
BASE_DIR = r"C:\Users\Raush\OneDrive\Documents\JEE_Project"
DB_DIR = os.path.join(BASE_DIR, "Vector_Database")

chroma_client = chromadb.PersistentClient(path=DB_DIR)
sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-MiniLM-L6-v2"
)

# Tumhara local database collection load ho raha hai
collection = chroma_client.get_collection(
    name="brahmastra_jee_v1", 
    embedding_function=sentence_transformer_ef
)

# Groq client setup (Check karna os.environ mein GROQ_API_KEY set ho)
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def get_relevant_context(query, num_results=3):
    """Database se sabse matching chunks dhoond kar nikalta hai"""
    results = collection.query(
        query_texts=[query],
        n_results=num_results
    )
    
    context = ""
    sources = []
    
    # Documents aur unke metadata ko extract karna
    if results and results['documents']:
        for doc, metadata in zip(results['documents'][0], results['metadatas'][0]):
            context += f"\n--- Context Source: {metadata['source_file']} ({metadata['category']}) ---\n{doc}\n"
            sources.append(metadata['source_file'])
            
    return context, list(set(sources))

def ask_brahmastra(question):
    # Step 1: Database se internal knowledge base context fetch karo
    context, source_files = get_relevant_context(question)
    
    # Step 2: Super Powerful Prompt for JEE Advanced multi-concept reasoning
    system_prompt = f"""
    You are 'Brahmastra AI' - the world's most precise academic engine for JEE Mains and JEE Advanced.
    Your task is to solve the student's question with 100% mathematical accuracy using the provided textbook and exam context.
    
    CRITICAL INSTRUCTIONS:
    1. If the question is a numerical/derivation from JEE, break it into:
       - 'Concept Anatomy': What core physics/maths principles are being tested.
       - 'Step-by-Step Logic': Clear algebraic progression.
       - 'The Unique Factor': How this problem diverts from generic questions.
    2. Cite the verified source files provided in the context to gain the student's absolute trust.
    3. FORMATTING: Use double backslashes for all LaTeX elements (e.g., \\frac, \\Delta, \\sigma). Wrap inline math in $...$ and block math in $$...$$.
    
    Provided Database Context:
    {context}
    """
    
    # Step 3: LLM Inference call
    chat_completion = client.chat.completions.create(
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": question}
        ],
        model="llama-3.3-70b-versatile",
        temperature=0.1 # Low temperature means zero hallucination, high precision factual results
    )
    
    answer = chat_completion.choices[0].message.content
    return answer, source_files

# Test execution zone
if __name__ == "__main__":
    test_query = "Explain the laws of motion or friction questions from 2019 data with step by step logic"
    print(f"🧐 Testing Brahmastra Engine with Query: '{test_query}'\n")
    
    ans, sources = ask_brahmastra(test_query)
    print("🤖 BRAHMASTRA OUTPUT:\n")
    print(ans)
    print(f"\n📚 Sources Cited: {sources}")