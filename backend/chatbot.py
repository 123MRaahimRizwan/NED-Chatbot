from sentence_transformers import SentenceTransformer, util
from retriever import retrieve_chunks
import os
from dotenv import load_dotenv
import re

# Load environment variables (especially for Qdrant if needed)
load_dotenv()

# Load embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")
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
    text = " ".join(text.split())
    return text


def extract_relevant_sentences(chunks, query, threshold=0.55):
    query_embedding = get_embedding(query)
    candidates = []

    for chunk in chunks:
        sentences = chunk.split(".")
        for s in sentences:
            s = s.strip()
            if len(s) < 20:
                continue

            sentence_embedding = get_embedding(s)
            score = util.cos_sim(query_embedding, sentence_embedding).item()
            if score > threshold:
                candidates.append((score, s))

    candidates.sort(reverse=True)
    return [s for _, s in candidates[:3]]


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


def generate_answer(query):
    if query in cache:
        return cache[query]

    chunks = retrieve_chunks(query, top_k=8)
    chunks = [clean_text(chunk) for chunk in chunks if chunk and chunk.strip()]
    relevant = extract_relevant_sentences(chunks, query)
    key_terms = extract_key_terms(query)

    if relevant and not contains_key_terms(relevant, key_terms):
        answer = "I couldn't find relevant information about that in the data."
        cache[query] = answer
        return answer

    if expects_number(query):
        if not contains_number(relevant):
            answer = "I couldn't find the exact number in the available data."
            cache[query] = answer
            return answer

    if relevant:
        print("Using direct retrieval")
        answer = " ".join(relevant[:3])
        cache[query] = answer
        return answer

    answer = "Sorry, I couldn't find a relevant answer in the data."
    cache[query] = answer
    return answer


def get_response(user_query):
    return generate_answer(user_query)
