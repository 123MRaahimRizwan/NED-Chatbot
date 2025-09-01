# # chatbot.py
# import pickle
# import numpy as np
# from sentence_transformers import SentenceTransformer
# import google.generativeai as genai
# import os


# # Load chunks and embeddings
# with open("chunks.pkl", "rb") as f:
#     chunks, embeddings = pickle.load(f)

# # Load embedding model
# embedder = SentenceTransformer("all-MiniLM-L6-v2")

# # Global variables to cache data
# cached_chunks = None
# cached_embeddings = None
# last_modified_time = 0

# def load_data_if_needed():
#     """Load chunks and embeddings only if the file has changed"""
#     global cached_chunks, cached_embeddings, last_modified_time
    
#     current_modified_time = os.path.getmtime("chunks.pkl")
    
#     if cached_chunks is None or current_modified_time > last_modified_time:
#         print("🔄 Reloading updated data...")
#         with open("chunks.pkl", "rb") as f:
#             cached_chunks, cached_embeddings = pickle.load(f)
#         last_modified_time = current_modified_time
#         print(f"✅ Loaded {len(cached_chunks)} chunks")

# # Gemini config
# genai.configure(api_key="AIzaSyAJx29bCioUOBP7tjP9t7Nmjuxu3d3dyAg")
# model = genai.GenerativeModel("gemini-2.5-flash")

# def get_response(user_query):
#     query_embedding = embedder.encode([user_query])[0]
#     similarities = np.dot(embeddings, query_embedding)
    
#     # Get top 3 matches
#     top_indices = np.argsort(similarities)[-3:][::-1]
#     top_chunks = [chunks[i]['text'] for i in top_indices]

#     context = "\n\n".join(top_chunks)

#     prompt = f"""You are a helpful university assistant. Use the following information from official university documents to answer the question truthfully and if you fail mention contact: (92-21) 99261261-8 for admission enqueries".:

# {context}

# Question: {user_query}
# Answer:"""

#     response = model.generate_content(prompt)
#     return response.text


import google.generativeai as genai
from sentence_transformers import SentenceTransformer
from retriever import retrieve_chunks
import os
from dotenv import load_dotenv

# Load environment variables (especially for Qdrant if needed)
load_dotenv()

# Load embedding model (for embedding the user query)
embedder = SentenceTransformer("all-MiniLM-L6-v2")

# Gemini configuration
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))  # Store your Gemini key in .env
model = genai.GenerativeModel("gemini-2.5-flash")

def classify_query(query):
    """Classify the query to determine relevant document types"""
    query = query.lower()
    
    # Define keywords for different categories
    phd_keywords = ['phd', 'doctor', 'doctoral', 'doctorate', 'research scholar', 'supervisor', 'thesis']
    undergraduate_keywords = ['undergraduate', 'bachelors', 'bs', 'be', 'admission test', 'first year', 'freshman']
    masters_keywords = ['masters', 'ms', 'mphil', 'graduate', 'postgraduate']
    
    doc_types = []
    if any(keyword in query for keyword in phd_keywords):
        doc_types.append('phd')
    if any(keyword in query for keyword in undergraduate_keywords):
        doc_types.append('undergraduate')
    if any(keyword in query for keyword in masters_keywords):
        doc_types.append('masters')
    
    # If no specific category is detected, return None to search all documents
    return doc_types if doc_types else None

def get_response(user_query):
    # Step 1: Embed the user query
    query_embedding = embedder.encode([user_query])[0]

    # Step 2: Retrieve top chunks from Qdrant
    top_chunks = retrieve_chunks(user_query, top_k=8)
    
    # Remove any empty chunks and ensure we have content
    top_chunks = [chunk for chunk in top_chunks if chunk and len(chunk.strip()) > 0]
    
    if not top_chunks:
        return "I apologize, but I couldn't access the relevant information at the moment. Please contact NED University at " \
        "Admission queries:(92-21) 99261261-8 General queries:(92-21) 99261261-8 or visit www.neduet.edu.pk/admission for accurate information."


    # Step 3: Prepare the context for Gemini
    context = "\n\n".join(top_chunks)

    prompt = f"""
You are a helpful and knowledgeable assistant for NED University. Your goal is to provide accurate and helpful information to students and visitors.

Use the following context from official university documents to answer the question. You can combine information from multiple chunks to form a complete answer.

Context from official documents:
{context}

Important instructions:
1. Answer based on the provided context and your understanding of academic concepts
2. If the information is partially available, provide what you know and explain any uncertainties
3. You can make reasonable inferences from the provided context
4. If you truly cannot find relevant information, suggest contacting the university:
   "For more specific information, please contact NED University at (92-21) 99261261-8 or visit www.neduet.edu.pk/admission"

Student's Question: "{user_query}"

Provide a helpful and informative answer:
"""

    # Step 4: Generate answer using Gemini
    # print("\n📨 Prompt sent to Gemini:\n", prompt[:3000], "\n")
    response = model.generate_content(prompt)
    return response.text
