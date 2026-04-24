import os
import hashlib
from datetime import datetime
from langchain.text_splitter import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
from pdf_parser import robust_pdf_parser
from ingestion_utils import upload_chunks_to_qdrant  # ✅ use this instead of saving to chunks.pkl
import pickle

class IncrementalDocumentProcessor:
    def __init__(self, data_dir="data", metadata_file="document_metadata.pkl"):
        self.data_dir = data_dir
        self.metadata_file = metadata_file
        self.model = SentenceTransformer("all-MiniLM-L6-v2")
        self.splitter = RecursiveCharacterTextSplitter(chunk_size=1500, chunk_overlap=300)
        
        # Load existing metadata
        self.metadata = self.load_metadata()
    
    def load_metadata(self):
        """Load metadata from pickle"""
        try:
            with open(self.metadata_file, "rb") as f:
                metadata = pickle.load(f)
            return metadata
        except FileNotFoundError:
            print("🆕 No metadata found. Starting fresh.")
            return {}

    def save_metadata(self):
        """Save updated metadata"""
        with open(self.metadata_file, "wb") as f:
            pickle.dump(self.metadata, f)

    def get_file_hash(self, file_path):
        """Hash a file to detect changes"""
        with open(file_path, 'rb') as f:
            return hashlib.md5(f.read()).hexdigest()
    
    def process_new_documents(self):
        updated = False

        for filename in os.listdir(self.data_dir):
            if not filename.endswith('.pdf'):
                continue

            file_path = os.path.join(self.data_dir, filename)
            file_hash = self.get_file_hash(file_path)

            # Skip unchanged files
            if filename in self.metadata and self.metadata[filename]['hash'] == file_hash:
                print(f"⏭️ Skipping unchanged document: {filename}")
                continue

            print(f"📄 Processing new/modified document: {filename}")
            text = robust_pdf_parser(file_path)
            if not text or len(text.strip()) < 50:
                print(f"❌ Failed to extract valid text from {filename}")
                continue

            # Chunking
            text_chunks = self.splitter.split_text(text)
            valid_chunks = [
                {"text": chunk, "source": filename, "timestamp": datetime.now().isoformat()}
                for chunk in text_chunks if len(chunk.strip()) > 20
            ]

            if not valid_chunks:
                print(f"⚠️ No valid chunks found in {filename}")
                continue

            # Upload to Qdrant
            chunk_texts = [c["text"] for c in valid_chunks]
            try:
                upload_chunks_to_qdrant(chunk_texts, source=filename)
                print(f"✅ Uploaded {len(valid_chunks)} chunks to Qdrant from {filename}")
            except Exception as e:
                print(f"❌ Failed to upload to Qdrant: {e}")
                continue

            # Update metadata
            self.metadata[filename] = {
                "hash": file_hash,
                "chunk_count": len(valid_chunks),
                "last_processed": datetime.now().isoformat(),
                "file_size": os.path.getsize(file_path)
            }

            updated = True

        if updated:
            self.save_metadata()
            print(f"💾 Metadata updated for {len(self.metadata)} documents")
        else:
            print("✨ No new documents to process.")

    def remove_deleted_documents(self):
        """(Optional) Track deletions locally, but Qdrant cleanup not implemented yet."""
        existing_files = set(os.listdir(self.data_dir))
        files_to_remove = []

        for filename in list(self.metadata.keys()):
            if not filename.endswith(".pdf") or filename not in existing_files:
                files_to_remove.append(filename)

        if files_to_remove:
            print(f"🗑️ Removed metadata for: {files_to_remove}")
            for filename in files_to_remove:
                del self.metadata[filename]
            self.save_metadata()
            # ⚠️ Optionally: delete vectors from Qdrant with filtering (not implemented here)

def run_incremental_ingestion():
    processor = IncrementalDocumentProcessor()
    processor.remove_deleted_documents()
    processor.process_new_documents()

if __name__ == "__main__":
    run_incremental_ingestion()
    print("✅ Incremental ingestion completed.")
