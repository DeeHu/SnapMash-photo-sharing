from flask import Flask
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_cors import CORS
from flask import request, jsonify
import json
import os

app = Flask(__name__)
CORS(app, resources={r'/*': {'origins': '*'}})
# CORS(app)

bcrypt = Bcrypt(app)
login_manager = LoginManager(app)

# Set the path to the users.json file
users_file = os.path.join(app.root_path, "users.json")

# Create the users.json file if it doesn't exist
if not os.path.exists(users_file):
    with open(users_file, "w") as f:
        json.dump([], f)

def load_users():
    """Load the users from the users.json file."""
    with open(users_file) as f:
        print(f)
        return json.load(f)

def save_users(users):
    """Save the users to the users.json file."""
    with open(users_file, "w") as f:
        json.dump(users, f)

@app.route('/')
def home():
    load_users()
    return 'Welcome to the Flask app!'

@app.errorhandler(Exception)
def handle_error(e):
    return jsonify(error=str(e)), 500


@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    # Load existing users
    users = load_users()

    # Check if user already exists
    if any(u['email'] == data['email'] for u in users):
        return jsonify({'message': 'User already exists'}), 400

    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = {"id": len(users) + 1, "name": data['name'], "email": data['email'], "password": hashed_password}

    # Add the new user to the list
    users.append(new_user)
    
    # Save the updated users to the file
    save_users(users)

    return jsonify({'message': 'User created successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    # Load existing users
    users = load_users()
    data = request.get_json()
    user = next((u for u in users if u['email'] == data['email']), None)
    if user and bcrypt.check_password_hash(user['password'], data['password']):
        return jsonify({'message': 'Logged in successfully'}), 200
    return jsonify({'message': 'Invalid credentials'}), 401

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
