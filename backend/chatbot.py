from sentence_transformers import SentenceTransformer, util
import google.generativeai as genai
import google.api_core.exceptions
from retriever import retrieve_chunks
import os
from dotenv import load_dotenv
import re
import requests

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


def generate_with_gemini(prompt):
    try:
        response = model_gemini.generate_content(prompt)
        return response.text.strip()
    except google.api_core.exceptions.ResourceExhausted as e:
        print(f"Gemini API quota exceeded: {e}")
        raise
    except Exception as e:
        print(f"Gemini API generic error: {e}")
        raise


def generate_with_deepseek(prompt):
    api_key = os.getenv("DEEPSEEK_API_KEY")
    url = "https://api.deepseek.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "deepseek-chat",
        "messages": [{"role": "user", "content": prompt}]
    }
    
    # Simple retry mechanism (up to 2 attempts)
    for attempt in range(2):
        try:
            response = requests.post(url, headers=headers, json=data, timeout=15)
            response.raise_for_status()
            result = response.json()
            if "choices" in result and len(result["choices"]) > 0:
                return result["choices"][0]["message"]["content"].strip()
            else:
                raise ValueError("Unexpected API response format.")
        except Exception as e:
            print(f"DeepSeek Error on attempt {attempt + 1}: {e}")
            if attempt == 1:
                raise


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

    print("Using Gemini for generation...")
    try:
        answer = generate_with_gemini(prompt)
    except Exception as e:
        print(f"Gemini failed, switching to DeepSeek. Error: {e}")
        try:
            print("Using DeepSeek for generation...")
            answer = generate_with_deepseek(prompt)
        except Exception as e2:
            print(f"DeepSeek also failed. Error: {e2}")
            answer = "⚠️ AI service temporarily unavailable. Please try again later."

    cache[query] = answer
    return answer


def get_response(user_query):
    return generate_answer(user_query)
