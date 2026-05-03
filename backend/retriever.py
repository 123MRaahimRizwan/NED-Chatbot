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
QDRANT_HOST = os.getenv("QDRANT_HOST")  # replace default if needed
QDRANT_COLLECTION = os.getenv("QDRANT_COLLECTION")

client = QdrantClient(
    url=QDRANT_HOST,
    api_key=QDRANT_API_KEY,
)

def retrieve_chunks(query, top_k=8):
    print(f"\n🔍 Searching for: {query}")
    
    query_vector = model.encode(query).tolist()

    try:
        response = client.query_points(
            collection_name=QDRANT_COLLECTION,
            query=query_vector,
            limit=top_k,
            with_payload=True
            # using="vector"
        )

        hits = response.points

        print(f"✅ Retrieved {len(hits)} chunks from Qdrant.")

        return [hit.payload["text"] for hit in hits if "text" in hit.payload]

    except Exception as e:
        print(f"❌ Error during Qdrant retrieval: {e}")
        return []
