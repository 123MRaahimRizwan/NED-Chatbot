from parser import robust_pdf_parser
from sentence_transformers import SentenceTransformer
import faiss
import pickle

model = SentenceTransformer('all-MiniLM-L6-v2')

def chunk_text(text, max_words=100):
    words = text.split()
    return [' '.join(words[i:i + max_words]) for i in range(0, len(words), max_words)]

def embed_chunks(chunks):
    embeddings = model.encode(chunks)
    index = faiss.IndexFlatL2(embeddings.shape[1])
    index.add(embeddings)
    return index, embeddings

def prepare_index_from_pdf(pdf_path='data/university_faq.pdf'):
    with open(pdf_path, 'rb') as f:
        raw_text = robust_pdf_parser(f)
    chunks = chunk_text(raw_text)
    index, _ = embed_chunks(chunks)
    with open('chunks.pkl', 'wb') as f:
        pickle.dump((chunks, index), f)
