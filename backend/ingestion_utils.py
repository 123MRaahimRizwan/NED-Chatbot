import os
import time
import pickle
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer

# Load env variables
load_dotenv()

DATA_FOLDER = os.path.join(os.path.dirname(__file__), "data")
BASE_DIR = os.path.dirname(__file__)
META_FILE = os.path.join(BASE_DIR, "document_metadata.pkl")

QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
QDRANT_URL = os.getenv("QDRANT_URL")
COLLECTION_NAME = "ned_docs"

client = QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY,
)

model = SentenceTransformer("all-MiniLM-L6-v2")

# def upload_chunks_to_qdrant(chunks, source):
#     embeddings = model.encode(chunks)

#     # Create collection if not exists
#     client.recreate_collection(
#         collection_name=COLLECTION_NAME,
#         vectors_config=VectorParams(
#             size=embeddings.shape[1],
#             distance=Distance.COSINE
#         )
#     )

#     points = [
#         PointStruct(
#             id=i,
#             vector=embedding,
#             payload={"text": chunk, "source": source}
#         )
#         for i, (embedding, chunk) in enumerate(zip(embeddings, chunks))
#     ]

#     client.upsert(
#         collection_name=COLLECTION_NAME,
#         points=points
#     )

def upload_chunks_to_qdrant(chunks, source):
    embeddings = model.encode(chunks)

    # Check if collection exists, create only if it doesn't
    collections = client.get_collections()
    collection_exists = any(col.name == COLLECTION_NAME for col in collections.collections)
    
    if not collection_exists:
        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(
                size=embeddings.shape[1],
                distance=Distance.COSINE
            )
        )

    # Get current count to use as starting ID for new points
    collection_info = client.get_collection(COLLECTION_NAME)
    start_id = collection_info.points_count

    # Create points with incremental IDs
    points = [
        PointStruct(
            id=start_id + i,
            vector={"vector": embedding},
            payload={"text": chunk, "source": source}
        )
        for i, (embedding, chunk) in enumerate(zip(embeddings, chunks))
    ]

    print("Upserting new documents.")
    if client.upsert(
        collection_name=COLLECTION_NAME,
        points=points
    ):
        print("Upserted.")
    else:
        print("An error occurred")
    # Upsert new points without affecting existing ones

def list_files():
    if os.path.exists(META_FILE):
        with open(META_FILE, "rb") as f:
            metadata = pickle.load(f)
    else:
        metadata = {}

    files = []
    for fname in os.listdir(DATA_FOLDER):
        path = os.path.join(DATA_FOLDER, fname)
        if os.path.isfile(path):
            last_modified = metadata.get(fname, {}).get("last_modified", os.path.getmtime(path))
            files.append({
                "filename": fname,
                "last_modified": time.ctime(last_modified)
            })
    return files

def delete_file(filename):
    path = os.path.join(DATA_FOLDER, filename)
    if os.path.exists(path):
        os.remove(path)

        from incremental_ingestion import IncrementalDocumentProcessor
        idp = IncrementalDocumentProcessor()
        idp.remove_deleted_documents()

        return True
    return False
