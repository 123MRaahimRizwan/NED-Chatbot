# from sentence_transformers import SentenceTransformer
# import pickle

# model = SentenceTransformer('all-MiniLM-L6-v2')

# def retrieve_chunks(query, top_k=5):
#     with open('chunks.pkl', 'rb') as f:
#         chunks, index = pickle.load(f)
#     query_vec = model.encode([query])
#     D, I = index.search(query_vec, top_k)
#     return [chunks[i] for i in I[0]]

# from sentence_transformers import SentenceTransformer
# from qdrant_client import QdrantClient
# from dotenv import load_dotenv
# import os

# # Load env variables
# load_dotenv()

# QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
# QDRANT_URL = os.getenv("QDRANT_URL")
# COLLECTION_NAME = "ned_docs"

# client = QdrantClient(
#     url=QDRANT_URL,
#     api_key=QDRANT_API_KEY,
# )

# model = SentenceTransformer("all-MiniLM-L6-v2")

# def retrieve_chunks(query, top_k=5):
#     query_vec = model.encode([query])[0]

    

#     results = client.search(
#         collection_name=COLLECTION_NAME,
#         query_vector=query_vec,
#         limit=top_k,
#         with_payload=True
#     )

#     return [hit.payload["text"] for hit in results]


from qdrant_client import QdrantClient
from qdrant_client.models import Filter, SearchRequest
from sentence_transformers import SentenceTransformer
import os
from dotenv import load_dotenv

load_dotenv()

# Load embedding model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Qdrant config
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
QDRANT_HOST = os.getenv("QDRANT_HOST", "https://your-qdrant-cluster.cloud")  # replace default if needed
QDRANT_COLLECTION = os.getenv("QDRANT_COLLECTION", "ned-chatbot")

client = QdrantClient(
    url=QDRANT_HOST,
    api_key=QDRANT_API_KEY,
)

def retrieve_chunks(query, top_k=8):
    print(f"\n🔍 Searching for: {query}")
    
    query_vector = model.encode(query).tolist()
    # print(f"📏 Query vector (first 5 dims): {query_vector[:5]}")

    try:
        hits = client.search(
            collection_name=QDRANT_COLLECTION,
            query_vector=query_vector,
            limit=top_k,
            with_payload=True
        )

        print(f"✅ Retrieved {len(hits)} chunks from Qdrant.")
        # for i, hit in enumerate(hits):
        #     chunk_text = hit.payload.get("text", "")[:100].replace("\n", " ")
        #     print(f"→ Chunk {i+1}: {chunk_text}...")

        return [hit.payload["text"] for hit in hits if "text" in hit.payload]

    except Exception as e:
        print(f"❌ Error during Qdrant retrieval: {e}")
        return []
