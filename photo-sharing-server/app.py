from flask import Flask
from flask_cors import CORS
from flask import request, jsonify
import json
import os

app = Flask(__name__)
CORS(app, resources={r'/*': {'origins': '*'}})

# ... rest of your code ...

@app.route('/')
def home():
    load_users()
    return 'Welcome to the Flask app!'

@app.errorhandler(Exception)
def handle_error(e):
    return jsonify(error=str(e)), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
