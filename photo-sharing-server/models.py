# models.py
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Date

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'User'
    ID = db.Column(db.String(20), primary_key=True)
    User_name = db.Column(db.String(100))
    Email = db.Column(db.String(20))
    Registration_date = db.Column(Date)

class Group(db.Model):
    __tablename__ = 'Group'
    ID = db.Column(db.Integer, primary_key=True)
    Name = db.Column(db.String(100))
    User_ID = db.Column(db.String(20), db.ForeignKey('User.ID'))

    # Define the relationship to User here
    user = db.relationship('User', backref='groups')
