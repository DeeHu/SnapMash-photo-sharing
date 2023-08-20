from models import db, User, Group, Photo
from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Date, create_engine
from flask_cors import CORS
import os
import datetime
import uuid

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
        user_id = request.form.get("user_id")
        new_photo = Photo(ID=generate_unique_id(), Created_date=datetime.date.today(), Store_path=os.path.join(path, filename), User_ID=user_id, Visibility_setting="Public")
        db.session.add(new_photo)
        db.session.commit()

        return jsonify({"message": "Image upload successful"}), 200
    else:
        return jsonify({"error": "Upload Failed: Uploaded file is not a image"}), 400

@app.route('/get-user-photos', methods=['GET'])
def get_user_photos():
    user_id = request.args.get('user_id')
    photos = db.session.query(Photo).filter_by(User_ID=user_id).all()
    # get store_paths
    # photo_paths = [photo.Store_path for photo in photos]
    # Get id, store_path, and User_ID for each photo
    photo_data = [{"id": photo.ID, "path": photo.Store_path, "User_ID": photo.User_ID} for photo in photos]
    
    return jsonify({"photos": photo_data})

@app.route('/images/<path:filename>', methods=['GET'])
def serve_image(filename):
    return send_from_directory('/app/storage/', filename)

@app.route('/delete-photo', methods=['POST'])
def delete_photo():
    photo_id = request.json.get('photo_id')
    user_id = request.json.get('user_id')
    
    photo = Photo.query.get(photo_id)
    if not photo:
        return jsonify({"error": "Photo not found"}), 404
    
    if photo.User_ID != user_id:
        return jsonify({"error": "Unauthorized action"}), 403

    db.session.delete(photo)
    db.session.commit()
    return jsonify({"message": "Photo deleted successfully"}), 200


def allowed_file(filename):
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def generate_unique_id():
    return str(uuid.uuid4())

if __name__ == "__main__":
    with app.app_context():
        create_tables()
    app.run(debug=True, host="0.0.0.0", port=5000)
