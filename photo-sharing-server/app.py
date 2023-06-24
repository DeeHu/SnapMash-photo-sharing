from flask import Flask
from flask_cors import CORS
from flask import request, jsonify, flash, redirect, url_for
from werkzeug.utils import secure_filename
import json
import os

UPLOAD_FOLDER = './test_photo'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
CORS(app, resources={r'/*': {'origins': '*'}})

# ... rest of your code ...

@app.route('/')
def home():
    load_users()
    return 'Welcome to the Flask app!'

@app.errorhandler(Exception)
def handle_error(e):
    return jsonify(error=str(e)), 500

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Citation: https://flask.palletsprojects.com/en/2.3.x/patterns/fileuploads/
@app.route('/create_photo',  methods = ['GET', 'POST'])
def create_photo():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return 'Upload Success'
        else:
            return 'Error: Unsupported file type'
    return '''
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new File</h1>
    <form method=post enctype=multipart/form-data>
      <input type=file name=file>
      <input type=submit value=Upload>
    </form>
    '''

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
