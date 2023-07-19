# models.py
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Date

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'
    ID = db.Column(db.String(20), primary_key=True)
    User_name = db.Column(db.String(100))
    Email = db.Column(db.String(100))
    Registration_date = db.Column(Date)
    groups = db.relationship('Group', secondary='user_group', backref=db.backref('users', lazy='dynamic'))


class Group(db.Model):
    __tablename__ = 'group'
    ID = db.Column(db.Integer, primary_key=True)
    Name = db.Column(db.String(100))


class UserGroup(db.Model):
    __tablename__ = 'user_group'
    ID = db.Column(db.Integer, primary_key=True)
    User_ID = db.Column(db.String(20), db.ForeignKey('user.ID'))
    Group_ID = db.Column(db.Integer, db.ForeignKey('group.ID'))

class Friendship(db.Model):
    __tablename__ = 'friendship'
    Friendship_ID = db.Column(db.Integer, primary_key=True)
    User_ID = db.Column(db.String(20), db.ForeignKey('user.ID'))
    Friend_ID = db.Column(db.String(20), db.ForeignKey('user.ID'))
    # Establishing relationship
    user = db.relationship('User', foreign_keys=[User_ID])
    friend = db.relationship('User', foreign_keys=[Friend_ID])
