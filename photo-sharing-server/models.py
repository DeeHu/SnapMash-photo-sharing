from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Date

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'
    ID = db.Column(db.String(100), primary_key=True)
    User_name = db.Column(db.String(100))
    Email = db.Column(db.String(100))
    Registration_date = db.Column(Date)
    groups = db.relationship('Group', secondary='user_group', backref=db.backref('users', lazy='dynamic'))

    def as_dict(self):
        return {
            'ID': self.ID,
            'User_name': self.User_name,
            'Email': self.Email,
            'Registration_date': self.Registration_date.strftime('%Y-%m-%d') if self.Registration_date else None
        }

class Group(db.Model):
    __tablename__ = 'group'
    ID = db.Column(db.Integer, primary_key=True)
    Name = db.Column(db.String(100))


class UserGroup(db.Model):
    __tablename__ = 'user_group'
    ID = db.Column(db.Integer, primary_key=True)
    User_ID = db.Column(db.String(100), db.ForeignKey('user.ID'))
    Group_ID = db.Column(db.Integer, db.ForeignKey('group.ID'))

class Friendship(db.Model):
    __tablename__ = 'friendship'
    Friendship_ID = db.Column(db.Integer, primary_key=True)
    User_ID = db.Column(db.String(100), db.ForeignKey('user.ID'))
    Friend_ID = db.Column(db.String(100), db.ForeignKey('user.ID'))
    Pending = db.Column(db.Boolean, default=True)
    # Establishing relationship
    user = db.relationship('User', foreign_keys=[User_ID])
    friend = db.relationship('User', foreign_keys=[Friend_ID])


class Photo(db.Model):
    __tablename__ = 'photo'
    ID = db.Column(db.String(100), primary_key=True)
    Created_date = db.Column(db.Date)
    Store_path = db.Column(db.String(100))
    User_ID = db.Column(db.String(100), db.ForeignKey('user.ID'))
    Visibility_setting = db.Column(db.String(100), db.ForeignKey('photo_visibility.Setting'))
    # Establishing relationships
    user = db.relationship('User', foreign_keys=[User_ID])
    setting = db.relationship('PhotoVisibility', foreign_keys=[Visibility_setting])

class PhotoVisibility(db.Model):
    __tablename__ = 'photo_visibility'
    Setting = db.Column(db.String(100), primary_key=True)

class ViewPhoto(db.Model):
    __tablename__ = 'view_photo'
    ViewPhoto_ID = db.Column(db.Integer, primary_key=True)
    User_ID = db.Column(db.String(100), db.ForeignKey('user.ID'))
    Photo_ID = db.Column(db.String(100), db.ForeignKey('photo.ID'))
    # Establishing relationships
    user = db.relationship('User', foreign_keys=[User_ID])
    photo = db.relationship('Photo', foreign_keys=[Photo_ID])

class Tag(db.Model):
    __tablename__ = 'tag'
    ID = db.Column(db.String(100), primary_key=True)
    Name = db.Column(db.String(100))
    Photo_ID = db.Column(db.String(100), db.ForeignKey('photo.ID'))
    Visibility_setting = db.Column(db.String(100), db.ForeignKey('tag_visibility.Setting'))
    # Establishing relationships
    photo = db.relationship('Photo', foreign_keys=[Photo_ID])
    setting = db.relationship('TagVisibility', foreign_keys=[Visibility_setting])

class TagVisibility(db.Model):
    __tablename__ = 'tag_visibility'
    Setting = db.Column(db.String(100), primary_key=True)

class PhotoTag(db.Model):
    __tablename__ = 'photo_tag'
    Photo_ID = db.Column(db.String(100), db.ForeignKey('photo.ID'),primary_key=True)
    Tag_ID = db.Column(db.String(100), db.ForeignKey('tag.ID'),primary_key=True)
    # Establishing relationships
    photo = db.relationship('Photo', foreign_keys=[Photo_ID])
    tag = db.relationship('Tag', foreign_keys=[Tag_ID])
