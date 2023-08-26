from models import db, User, Group, Photo, Friendship
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

@app.route('/users', methods=['GET'])
def get_user():
    email = request.args.get('email')
    user = User.query.filter_by(Email=email).first()
    if user:
        return jsonify({"ID": user.ID, "User_name": user.User_name, "Email": user.Email})
    return jsonify({"error": "User not found"}), 404

@app.route('/friendship', methods=['POST'])
def send_friend_request():
    data = request.json
    if data['User_ID'] == data['Friend_ID']:
        return jsonify({"message": "You can't send a friend request to yourself!"}), 400
    existing_request = Friendship.query.filter(
        db.or_(
            db.and_(Friendship.User_ID == data['User_ID'], Friendship.Friend_ID == data['Friend_ID']),
            db.and_(Friendship.User_ID == data['Friend_ID'], Friendship.Friend_ID == data['User_ID'])
        )
    ).first()
    if existing_request:
        if existing_request.Pending:
            return jsonify({"message": "Friend request already sent and is pending"}), 400
        else:
            return jsonify({"message": "These users are already friends"}), 400
    friendship = Friendship(User_ID=data['User_ID'], Friend_ID=data['Friend_ID'])
    try:
        db.session.add(friendship)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error: {str(e)}"}), 500
    return jsonify({"message": "Friend request sent"}), 201

@app.route("/users", methods=["GET"])
def get_users():
    all_users = User.query.all()
    return jsonify({"users": [user.username for user in all_users]})

@app.route('/friendship', methods=['DELETE'])
def delete_friend_request():
    data = request.json
    user_id = data.get('User_ID')
    friend_id = data.get('Friend_ID')
    friend_request = Friendship.query.filter_by(User_ID=user_id, Friend_ID=friend_id, Pending=True).first()
    if not friend_request:
        return jsonify({"message": "Friend request not found"}), 404
    try:
        db.session.delete(friend_request)
        db.session.commit()
        return jsonify({"message": "Friend request deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error: {str(e)}"}), 500

@app.route('/pending-friend-requests', methods=['GET'])
def pending_friend_requests():
    current_user_id = request.args.get('currentUserId')

    received_requests = Friendship.query.filter_by(Friend_ID=current_user_id, Pending=True).all()
    received_list = [{'id': fr.User_ID, 'email': fr.user.Email} for fr in received_requests]

    sent_requests = Friendship.query.filter_by(User_ID=current_user_id, Pending=True).all()
    sent_list = [{'id': fr.Friend_ID, 'email': fr.friend.Email} for fr in sent_requests]

    return jsonify({'received': received_list, 'sent': sent_list})

@app.route('/accept-friend-request', methods=['POST'])
def accept_friend_request():
    friend_id = request.json['friendId']
    current_user_id = request.json['currentUserId']
    friendship = Friendship.query.filter_by(User_ID=friend_id, Friend_ID=current_user_id).first()
    if friendship:
        friendship.Pending = False
        db.session.commit()
        return jsonify({"message": "Accepted"}), 200
    else:
        return jsonify({"message": "Friend request not found"}), 404

@app.route('/decline-friend-request', methods=['POST'])
def decline_friend_request():
    friend_id = request.json['friendId']
    current_user_id = request.json['currentUserId']
    friendship = Friendship.query.filter_by(User_ID=friend_id, Friend_ID=current_user_id).delete()
    db.session.commit()
    if friendship:
        return jsonify({"message": "Declined"}), 200
    else:
        return jsonify({"message": "Friend request not found"}), 404

@app.route('/friend-list', methods=['GET'])
def get_friend_list():
    current_user_id = request.args.get('currentUserId')
    friendships = Friendship.query.filter(((Friendship.User_ID == current_user_id) | (Friendship.Friend_ID == current_user_id)) & (Friendship.Pending == False)).all()
    friends = [fr.user if fr.User_ID != current_user_id else fr.friend for fr in friendships]
    return jsonify([{'id': friend.ID, 'email': friend.Email} for friend in friends])

@app.route('/delete-friend', methods=['DELETE'])
def delete_friend():
    current_user_id = request.args.get('currentUserId')
    friend_id = request.args.get('friendId')

    friendship = Friendship.query.filter_by(User_ID=current_user_id, Friend_ID=friend_id).first()
    if not friendship:
        friendship = Friendship.query.filter_by(User_ID=friend_id, Friend_ID=current_user_id).first()
    if friendship:
        db.session.delete(friendship)
        db.session.commit()
        return jsonify({"message": "Friend deleted successfully"}), 200
    else:
        return jsonify({"message": "Friendship not found"}), 404


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

        # visibility
        visibility_setting = request.form.get("visibility", "Public")

        # Save the image to the database
        # new_image = Image(filename=filename, user_id=1)
        user_id = request.form.get("user_id")
        new_photo = Photo(ID=generate_unique_id(), 
                          Created_date=datetime.date.today(), 
                          Store_path=os.path.join(path, filename), 
                          User_ID=user_id, 
                          Visibility_setting=visibility_setting)
        db.session.add(new_photo)
        db.session.commit()

        return jsonify({"message": "Image upload successful"}), 200
    else:
        return jsonify({"error": "Upload Failed: Uploaded file is not a image"}), 400

@app.route('/get-user-photos', methods=['GET'])
def get_user_photos():
    target_uid = request.args.get('target_uid')
    current_uid = request.args.get('current_uid')
    # user_id = request.args.get('user_id')
    if not target_uid:
        return jsonify({"error": "target_uid is required"}), 400

    target_user = db.session.query(User).filter_by(ID=target_uid).first()

    if not target_user:
        return jsonify({"error": "No user found with the given UID"}), 404

    # Check if the user is viewing their own dashboard:
    if target_uid == current_uid:
        photos = db.session.query(Photo).filter_by(User_ID=target_uid).all()
    else:
        # If viewing a friend's dashboard, only show photos with visibility "Public" or "Friends"
        photos = db.session.query(Photo).filter_by(User_ID=target_uid).filter(Photo.Visibility_setting.in_(["Public", "Friends"])).all()

    # photos = db.session.query(Photo).filter_by(User_ID=user_id).all()
    # Get id, store_path, and User_ID for each photo
    photo_data = [{"id": photo.ID, "path": photo.Store_path, "User_ID": photo.User_ID, "Visibility_setting": photo.Visibility_setting} for photo in photos]
    
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

@app.route('/change-photo-visibility', methods=['POST'])
def change_photo_visibility():
    try:
        photo_id = request.json.get('photo_id')
        new_visibility = request.json.get('visibility')
        
        photo = Photo.query.filter_by(ID=photo_id).first()
        if not photo:
            return jsonify({"message": "Photo not found"}), 404
        
        photo.Visibility_setting = new_visibility
        db.session.commit()
        
        return jsonify({"message": "Visibility updated successfully"}), 200
        
    except Exception as e:
        return jsonify({"message": "Error updating visibility", "error": str(e)}), 500



def allowed_file(filename):
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def generate_unique_id():
    return str(uuid.uuid4())

if __name__ == "__main__":
    with app.app_context():
        create_tables()
    app.run(debug=True, host="0.0.0.0", port=5000)
