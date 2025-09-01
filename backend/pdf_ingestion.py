# # pdf_ingestion.py

# import os
# import pickle
# from PyPDF2 import PdfReader
# from langchain.text_splitter import RecursiveCharacterTextSplitter
# from sentence_transformers import SentenceTransformer

# # Step 1: Read all PDFs
# all_texts = []

# for filename in os.listdir("data"):
#     if filename.endswith(".pdf"):
#         reader = PdfReader(f"data/{filename}")
#         text = "\n".join([page.extract_text() for page in reader.pages if page.extract_text()])
#         if not text:
#             print(f"[Warning] No text found in: {filename}")
#         all_texts.append((filename, text))

# # Step 2: Chunk and tag
# splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=200)
# chunks = []
# for source_name, text in all_texts:
#     for chunk in splitter.split_text(text):
#         chunks.append({"text": chunk, "source": source_name})

# # Step 3: Embed
# model = SentenceTransformer("all-MiniLM-L6-v2")
# texts = [c["text"] for c in chunks]
# embeddings = model.encode(texts)

# # Step 4: Save chunks + embeddings
# with open("chunks.pkl", "wb") as f:
#     pickle.dump((chunks, embeddings), f)

# print(f"✅ Processed and saved {len(chunks)} chunks from {len(all_texts)} PDFs.")



# pdf_ingestion.py - Improved version with OCR support for scanned PDFs

import os
import pickle
from langchain.text_splitter import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
from parser import extract_text_from_PDF

# Step 1: Read all PDFs using the robust parser
all_texts = []
failed_pdfs = []

print(" Processing PDFs...")
for filename in os.listdir("data"):
    if filename.endswith(".pdf"):
        file_path = f"data/{filename}"
        print(f"📄 Processing: {filename}")
        
        # Use the robust parser that handles scanned PDFs
        text = extract_text_from_PDF(file_path)
        
        if text and len(text.strip()) > 50:  # Ensure we got meaningful text
            all_texts.append((filename, text))
            print(f"✅ Successfully extracted {len(text)} characters from {filename}")
        else:
            failed_pdfs.append(filename)
            print(f"❌ Failed to extract text from {filename}")

print(f"\n Summary:")
print(f"✅ Successfully processed: {len(all_texts)} PDFs")
print(f"❌ Failed to process: {len(failed_pdfs)} PDFs")

if failed_pdfs:
    print(f"\nFailed PDFs: {failed_pdfs}")

# Step 2: Chunk and tag
print("\n🔪 Chunking text...")
splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=200)
chunks = []

for source_name, text in all_texts:
    text_chunks = splitter.split_text(text)
    for chunk in text_chunks:
        if len(chunk.strip()) > 20:  # Only keep meaningful chunks
            chunks.append({"text": chunk, "source": source_name})
    
    print(f"📝 Created {len(text_chunks)} chunks from {source_name}")

# Step 3: Embed
print(f"\n🧠 Creating embeddings for {len(chunks)} chunks...")
model = SentenceTransformer("all-MiniLM-L6-v2")
texts = [c["text"] for c in chunks]
embeddings = model.encode(texts, show_progress_bar=True)

# Step 4: Save chunks + embeddings
print(f"\n Saving to chunks.pkl...")
with open("chunks.pkl", "wb") as f:
    pickle.dump((chunks, embeddings), f)

print(f"✅ Successfully processed and saved {len(chunks)} chunks from {len(all_texts)} PDFs.")
print(f" Saved to: chunks.pkl")
