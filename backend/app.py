from flask import Flask, request, jsonify
from flask_cors import CORS
from markupsafe import Markup
import markdown
from chatbot import get_response
from flask_login import LoginManager
from admin_routes import admin
from auth_routes import auth

app = Flask(__name__)
# CORS(app)  # Allow requests from the React frontend
CORS(app, origins=["http://localhost:5173", "http://localhost:5174"], supports_credentials=True)
app.secret_key = "supersecretkey"

# Setup login manager
login_manager = LoginManager()
login_manager.init_app(app)

app.register_blueprint(admin)
app.register_blueprint(auth)

@app.route("/api/ask", methods=["POST"])
def ask():
    data = request.get_json()
    user_question = data.get("question", "")
    response = get_response(user_question)

    # Convert response to Markdown and return as HTML string
    # response_html = Markup(markdown.markdown(response))
    
    return jsonify({
        "question": user_question,
        "answer": response.strip()
    })


if __name__ == "__main__":
    app.run(debug=True)
