from sentence_transformers import SentenceTransformer, util
import google.generativeai as genai
from retriever import retrieve_chunks
import os
from dotenv import load_dotenv
import re

# Load environment variables (especially for Qdrant if needed)
load_dotenv()

# Load embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model_gemini = genai.GenerativeModel("gemini-3-flash-preview")

cache = {}
embedding_cache = {}

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

def get_embedding(text):
    if text not in embedding_cache:
        embedding_cache[text] = model.encode(text, convert_to_tensor=True)
    return embedding_cache[text]


def clean_text(text):
    text = text.replace("\n", " ")
    text = re.sub(r"\s+", " ", text)

    # remove weird numbering patterns like "76 5(a)"
    text = re.sub(r"\b\d+\s*\(?[a-z]?\)?", "", text)

    return text.strip()


def generate_with_gemini(query, chunks):
    context = "\n\n".join(chunks[:5])  # limit to avoid overload

    prompt = f"""
        You are a helpful university assistant.

        Answer the user's question based ONLY on the context below.
        If the answer is not clearly available, say so politely.

        Context:
        {context}

        Question:
        {query}

        Answer clearly and concisely:
        """

    response = model_gemini.generate_content(prompt)

    return response.text.strip()


def expects_number(query):
    return any(k in query.lower() for k in ["how many", "number", "total", "count"])


def contains_number(sentences):
    return any(re.search(r"\d+", s) for s in sentences)


def extract_key_terms(query):
    stopwords = {
        "the", "is", "are", "a", "an", "of", "do", "you", "know", "about",
        "tell", "me", "what", "when", "where", "how"
    }

    words = query.lower().split()
    return [w for w in words if w not in stopwords and len(w) > 3]


def contains_key_terms(sentences, key_terms, min_match=2):
    combined = " ".join(sentences).lower()
    matches = sum(1 for term in key_terms if term in combined)
    return matches >= min_match

def format_answer(sentences):
    clean = []

    for s in sentences:
        s = s.strip()

        # capitalize properly
        s = s[0].upper() + s[1:] if s else s

        clean.append(s)

    return " ".join(clean)


def generate_answer(query):
    if query in cache:
        return cache[query]

    chunks = retrieve_chunks(query, top_k=8)
    chunks = [clean_text(c) for c in chunks if c and c.strip()]

    if not chunks:
        answer = "Sorry, I couldn't find relevant information in the data."
        cache[query] = answer
        return answer

    print("Using Gemini for generation...")
    answer = generate_with_gemini(query, chunks)

    cache[query] = answer
    return answer


def get_response(user_query):
    return generate_answer(user_query)
