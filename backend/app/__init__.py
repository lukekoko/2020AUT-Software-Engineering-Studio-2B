from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from app import database

app = Flask(__name__)
CORS(app)
app.config.from_object('config')

app.config['JWT_SECRET_KEY'] = 'memes'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False

database.init_db()

@app.teardown_appcontext
def shutdown_session(exception=None):
    database.db_session.remove()


from app import views, models, auth