from flask import Blueprint, request, jsonify, session
from flask_login import LoginManager, login_user, logout_user, login_required, UserMixin
from dotenv import load_dotenv
import os

auth = Blueprint('auth', __name__)

# Dummy user setup (can later use DB)
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")

class AdminUser(UserMixin):
    def __init__(self, id):
        self.id = id

@auth.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
        user = AdminUser(id=username)
        login_user(user)
        session["username"] = username
        return jsonify({"message": "Login successful"})
    return jsonify({"error": "Invalid credentials"}), 401

@auth.route("/logout", methods=["POST"])
# @login_required
def logout():
    # logout_user()
    # session.clear()
    # return jsonify({"message": "Logged out successfully"})
    session.pop("authenticated", None)
    return jsonify({"message": "Logged out successfully"}), 200

@auth.route("/check-auth", methods=["GET"])
def check_auth():
    return jsonify({"authenticated": "username" in session})
