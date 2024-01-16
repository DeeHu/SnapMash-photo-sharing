from flask import Flask, app
from sqlalchemy import create_engine
from .models.models import db
from flask_cors import CORS
import os
from dotenv import load_dotenv


def create_app():
    # Load environment variables
    load_dotenv()

    # Create a Flask application instance
    app = Flask(__name__)

    # Configure the app
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Initialize extensions with the app
    db.init_app(app)
    CORS(app, resources={
        r"/*": {
            "origins": "http://localhost:3000",
            "allow_headers": ["Content-Type", "Authorization", "Access-Control-Allow-Headers"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
        }
    })

    from .routes.user_routes import user_bp
    from .routes.photo_routes import photo_bp

    app.register_blueprint(user_bp, url_prefix='/')
    app.register_blueprint(photo_bp, url_prefix='/')

    @app.route("/")
    def hello():
        try:
            engine = create_engine(app.config["SQLALCHEMY_DATABASE_URI"])
            connection = engine.connect()
            connection.close()
            return "Database connected successfully!"
        except Exception as e:
            return str(e)
    
    return app
    
    
def create_tables():
    db.create_all()  # This will create tables according to the above schema if they do not exist





