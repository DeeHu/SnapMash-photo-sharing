from models import db, User, Group
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Date, create_engine
from flask_cors import CORS
import os

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ[
    "DATABASE_URL"
]  # Use the DATABASE_URL from env variable
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)
cors = CORS(app, resources={
    r"/*": {
        "origins": "http://localhost:3000",
        "allow_headers": [
            "Content-Type",
            "Authorization",
            "Access-Control-Allow-Headers"
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]  # update this list with your methods
    }
})


def create_tables():
    db.create_all()  # This will create tables according to the above schema if they do not exist


@app.route("/")
def hello():
    try:
        engine = create_engine(app.config["SQLALCHEMY_DATABASE_URI"])
        connection = engine.connect()
        connection.close()
        return "Database connected successfully!"
    except Exception as e:
        return str(e)


@app.route("/user", methods=["POST"])
def create_user():
    data = request.get_json()
    print('Received data:', data)

    new_user = User(ID=data['uid'],User_name=data['name'], Email=data['email'], Registration_date=data['date'])
    print('New user:', new_user)

    try:
        db.session.add(new_user)
        db.session.commit()
        print('User added successfully')
    except Exception as e:
        db.session.rollback()
        print('Error:', str(e))
        return jsonify({'error': str(e)}), 409
    return jsonify({"message": "User created"}), 201


@app.route("/users", methods=["GET"])
def get_users():
    all_users = User.query.all()
    return jsonify({"users": [user.username for user in all_users]})


@app.route("/process", methods=["POST"])
def process():
    print (request.files)
    if "img" not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files["img"]
    if file.filename == "":
        return jsonify({"error": "No file selected for uploading"}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        path = request.form.get(
            "path",
            "/app/storage",
        )  # the path where the image is going to be saved(in development)
        os.makedirs(path, exist_ok=True)  # create the directory if it doesn't exist
        file.save(os.path.join(path, filename))

        # Save the image to the database
        # new_image = Image(filename=filename, user_id=1)
        # db.session.add(new_image)
        # db.session.commit()

        return jsonify({"message": "Image upload successful"}), 200
    else:
        return jsonify({"error": "Upload Failed: Uploaded file is not a image"}), 400


def allowed_file(filename):
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


if __name__ == "__main__":
    with app.app_context():
        create_tables()
    app.run(debug=True, host="0.0.0.0", port=5000)
