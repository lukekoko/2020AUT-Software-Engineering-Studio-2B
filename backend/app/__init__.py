from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_socketio import SocketIO

from app import database

app = Flask(__name__)
app.config.from_object('config')

app.config['JWT_SECRET_KEY'] = 'memes'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False
app.config['SECRET_KEY'] = 'secret!'

CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# database.init_db()

# database.destroy_db() # Remove all tables and data from db
database.reset_db() # Recreate db

@app.teardown_appcontext
def shutdown_session(exception=None):
    database.db_session.remove()


from app import views, models, auth, chat, tasks

def populate_db():
    room = models.ChatRooms(name="General")
    user = models.User(name="test", email="test@gmail.com", password="$2b$12$wmAorIYQNm2VYr24pF/9QOz9HwXNoa0rjo8dHZihbxPC19dcid1mG", userType=0)
    user.rooms.append(room)
    database.db_session.add(user)
    user = models.User(name="test1", email="test1@gmail.com", password="$2b$12$wmAorIYQNm2VYr24pF/9QOz9HwXNoa0rjo8dHZihbxPC19dcid1mG", userType=0)
    user.rooms.append(room)
    database.db_session.add(user)
    user = models.User(name="test2", email="test2@gmail.com", password="$2b$12$wmAorIYQNm2VYr24pF/9QOz9HwXNoa0rjo8dHZihbxPC19dcid1mG", userType=0)
    user.rooms.append(room)
    database.db_session.add(user)
    user = models.User(name="test3", email="test3@gmail.com", password="$2b$12$wmAorIYQNm2VYr24pF/9QOz9HwXNoa0rjo8dHZihbxPC19dcid1mG", userType=0)
    user.rooms.append(room)
    database.db_session.add(user)
    database.db_session.commit()

populate_db() # fill db with test user