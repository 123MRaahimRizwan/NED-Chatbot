from flask import Blueprint, request, jsonify
import os
from werkzeug.utils import secure_filename
# import shutil
from incremental_ingestion import run_incremental_ingestion
from ingestion_utils import list_files, delete_file
from datetime import datetime
import pickle
# from flask_login import login_required

admin = Blueprint('admin', __name__)

DATA_FOLDER =  os.path.join(os.path.dirname(__file__), "data")

@admin.route("/admin/files", methods=["GET"])
# @login_required
def list_uploaded_files():
    try:
        files = []
        for f in os.listdir(DATA_FOLDER):
            if f.endswith(".pdf"):
                full_path = os.path.join(DATA_FOLDER, f)
                print(f"[INFO] Found file: {full_path}") # Debugging line
                modified_time = os.path.getmtime(full_path)
                files.append({
                    "filename": f,
                    "last_modified": datetime.fromtimestamp(modified_time).isoformat()
                })
        return jsonify(files)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    


@admin.route("/admin/upload", methods=["POST"])
# @login_required
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files['file']
    filename = secure_filename(file.filename)
    filepath = os.path.join(DATA_FOLDER, filename)
    try:
        file.save(filepath)
        print(f"[INFO] Saved file to {filepath}")

        # ✅ Automatically trigger ingestion
        run_incremental_ingestion()
        print(f"[INFO] Ingestion completed for {filename}")

        return jsonify({"message": f"{filename} uploaded and ingested."})

    except Exception as e:
        print(f"[ERROR] Upload or ingestion failed: {e}")
        return jsonify({"error": str(e)}), 500



@admin.route("/admin/delete", methods=["POST"])
# @login_required
def delete_pdf():
    data = request.get_json()
    filename = data.get("filename")
    if not filename:
        return jsonify({"error": "No filename provided"}), 400

    success = delete_file(filename)
    if success:
        return jsonify({"message": f"{filename} deleted."})
    else:
        return jsonify({"error": "File not found"}), 404



@admin.route("/admin/stats", methods=["GET"])
# @login_required
def get_stats():
    try:
        # meta_file = "backend/document_metadata.pkl"
        # chunks_file = "backend/chunks.pkl"
        BASE_DIR = os.path.dirname(__file__)  # This will be 'backend/'
        META_FILE = os.path.join(BASE_DIR, "document_metadata.pkl")
        CHUNKS_FILE = os.path.join(BASE_DIR, "chunks.pkl")

        if not os.path.exists(META_FILE) or not os.path.exists(CHUNKS_FILE):
            return jsonify({"error": "Metadata not available"}), 404

        # Load metadata
        with open(META_FILE, "rb") as f:
            metadata = pickle.load(f)

        # Load chunks
        with open(CHUNKS_FILE, "rb") as f:
            chunks, embeddings = pickle.load(f)

        stats = {
            "total_pdfs": len(metadata),
            "total_chunks": len(chunks),
            "total_embeddings": len(embeddings),
            "last_ingestion_time": datetime.strptime(
                max([meta["last_processed"] for meta in metadata.values()]),
                "%Y-%m-%dT%H:%M:%S.%f"
            ).strftime("%d/%m/%y, %H:%M:%S") if metadata else "N/A"
        }

        return jsonify(stats)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
