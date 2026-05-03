# 🤖 RAG Chatbot with Qdrant + Gemini + DeepSeek Fallback

A production-ready **Retrieval-Augmented Generation (RAG)** chatbot built with:

* 🔎 **Qdrant** for vector search
* 🧠 **SentenceTransformers** for embeddings
* ✨ **Gemini API** for primary LLM responses
* 🔁 **DeepSeek API** as fallback (when Gemini quota is exceeded)
* ⚙️ **Flask** backend

---

## 🚀 Features

* ✅ Semantic search using Qdrant
* ✅ Context-aware answers (RAG pipeline)
* ✅ Gemini as primary LLM
* ✅ Automatic fallback to DeepSeek
* ✅ Handles API failures gracefully (no crashes)
* ✅ Clean modular backend design
* ✅ Easy to extend with other models

---

## 🧠 Architecture

```text
User Query
    ↓
Embedding (SentenceTransformer)
    ↓
Qdrant Vector Search
    ↓
Top-K Relevant Chunks
    ↓
Prompt निर्माण
    ↓
        ┌───────────────┐
        │   Gemini API  │
        └──────┬────────┘
               │ (if fails / quota exceeded)
               ↓
        ┌───────────────┐
        │ DeepSeek API  │
        └───────────────┘
               ↓
          Final Answer
```

---

## 📂 Project Structure

```bash
backend/
│
├── app.py              # Flask app entry point
├── chatbot.py          # RAG + generation logic
├── retriever.py        # Qdrant retrieval logic
├── .env                # API keys (not committed)
├── requirements.txt
```

---

## ⚙️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo/backend
```

---

### 2. Create virtual environment

```bash
python -m venv venv
venv\Scripts\activate   # Windows
# OR
source venv/bin/activate  # Mac/Linux
```

---

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

---

### 4. Configure environment variables

Create a `.env` file:

```env
# Qdrant
QDRANT_HOST=your_qdrant_url
QDRANT_API_KEY=your_qdrant_api_key
QDRANT_COLLECTION=your_collection_name

# Gemini
GOOGLE_API_KEY=your_gemini_api_key

# DeepSeek (fallback)
DEEPSEEK_API_KEY=your_deepseek_api_key
```

---

### 5. Run the server

```bash
python app.py
```

Server will start at:

```
http://127.0.0.1:5000
```

---

## 🔄 How Fallback Works

1. User sends a query
2. System retrieves relevant chunks from Qdrant
3. Gemini generates response
4. If Gemini fails (e.g. quota exceeded):

   * Automatically switches to DeepSeek
5. If both fail → returns safe error message

---

## 🧪 Example Flow

```text
User: "Who are the professors in CSIT department?"

→ Qdrant retrieves context
→ Gemini generates answer

IF Gemini quota exceeded:
→ DeepSeek generates answer instead
```

---

## ⚠️ Known Limitations

* Gemini free tier has strict limits (e.g. 20 requests/day)
* DeepSeek API requires credits after trial usage
* Response quality depends on embedded data quality
* No streaming responses (yet)

---

## 🔧 Future Improvements

* [ ] Add caching (reduce API usage)
* [ ] Streaming responses (real-time typing)
* [ ] Hybrid search (BM25 + vector)
* [ ] Frontend UI (React / Next.js)
* [ ] Chat history memory
* [ ] Model routing (smart cost optimization)

---

## 🛡️ Error Handling

This project ensures:

* No crashes on API failure
* Graceful fallback between models
* User-friendly error messages

---

## 📦 Tech Stack

* Python (Flask)
* Qdrant (Vector DB)
* SentenceTransformers
* Gemini API
* DeepSeek API

---

## 🤝 Contributing

Pull requests are welcome!

If you’d like to improve:

* performance
* UI
* model integration

Feel free to fork and submit a PR.

---

## 📄 License

MIT License

---

## ⭐ Acknowledgements

* Qdrant team for vector DB
* Google Gemini API
* DeepSeek for affordable LLM API

---

## 💡 Author

Built by **[Your Name]**

If you found this useful, give it a ⭐ on GitHub!
