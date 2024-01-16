from flask import Blueprint, request, jsonify
from sqlalchemy import create_engine
from ..models.models import Friendship, User, db  # Adjust the import path as needed
from ..utils import generate_unique_id  # Assuming utility functions are in utils.py

user_bp = Blueprint('user_bp', __name__)


@user_bp.route("/user", methods=["POST"])
def create_user():
    data = request.get_json()
    new_user = User(
        ID=generate_unique_id(), 
        User_name=data['name'], 
        Email=data['email'], 
        Registration_date=data['date']
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User created"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 409

@user_bp.route('/user/<string:ID>', methods=['GET'])
def get_user_by_id(ID):
    user = User.query.filter_by(ID=ID).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(user.as_dict())

# when searching freinds
@user_bp.route('/users', methods=['GET'])
def get_user():
    email = request.args.get('email')
    user = User.query.filter_by(Email=email).first()
    if user:
        return jsonify({"ID": user.ID, "User_name": user.User_name, "Email": user.Email})
    return jsonify({"error": "User not found"}), 404

@user_bp.route('/friendship', methods=['POST'])
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

@user_bp.route("/users", methods=["GET"])
def get_users():
    all_users = User.query.all()
    return jsonify({"users": [user.username for user in all_users]})

@user_bp.route('/friendship', methods=['DELETE'])
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

@user_bp.route('/pending-friend-requests', methods=['GET'])
def pending_friend_requests():
    current_user_id = request.args.get('currentUserId')

    received_requests = Friendship.query.filter_by(Friend_ID=current_user_id, Pending=True).all()
    received_list = [{'id': fr.User_ID, 'email': fr.user.Email} for fr in received_requests]

    sent_requests = Friendship.query.filter_by(User_ID=current_user_id, Pending=True).all()
    sent_list = [{'id': fr.Friend_ID, 'email': fr.friend.Email} for fr in sent_requests]

    return jsonify({'received': received_list, 'sent': sent_list})

@user_bp.route('/accept-friend-request', methods=['POST'])
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

@user_bp.route('/decline-friend-request', methods=['POST'])
def decline_friend_request():
    friend_id = request.json['friendId']
    current_user_id = request.json['currentUserId']
    friendship = Friendship.query.filter_by(User_ID=friend_id, Friend_ID=current_user_id).delete()
    db.session.commit()
    if friendship:
        return jsonify({"message": "Declined"}), 200
    else:
        return jsonify({"message": "Friend request not found"}), 404

@user_bp.route('/friend-list', methods=['GET'])
def get_friend_list():
    current_user_id = request.args.get('currentUserId')
    friendships = Friendship.query.filter(((Friendship.User_ID == current_user_id) | (Friendship.Friend_ID == current_user_id)) & (Friendship.Pending == False)).all()
    friends = [fr.user if fr.User_ID != current_user_id else fr.friend for fr in friendships]
    return jsonify([{'id': friend.ID, 'email': friend.Email} for friend in friends])

@user_bp.route('/delete-friend', methods=['DELETE'])
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
