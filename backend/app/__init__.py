from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_socketio import SocketIO

import os
import pathlib
logPath = str(pathlib.Path(__file__).resolve().parent) + '/config/logger.ini'

print(logPath)
from pathlib import Path
Path("./logs/").mkdir(parents=True, exist_ok=True)

import logging.config

logging.config.fileConfig(
    logPath, disable_existing_loggers=False
)
logger = logging.getLogger(__name__)

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
    room = models.ChatRooms(name="General", roomName="General")
    team  = models.Team(name="team1", leaderId=1)
    user = models.User(name="test", email="test@gmail.com", password="$2b$12$wmAorIYQNm2VYr24pF/9QOz9HwXNoa0rjo8dHZihbxPC19dcid1mG", userType=0)
    user.rooms.append(room)
    database.db_session.add(user)
    team.users.append(user)
    user = models.User(name="John", email="John@John.com", password="$2b$12$wmAorIYQNm2VYr24pF/9QOz9HwXNoa0rjo8dHZihbxPC19dcid1mG", userType=0)
    user.rooms.append(room)
    database.db_session.add(user)
    team.users.append(user)
    user = models.User(name="Olivia", email="Olivia@gmail.com", password="$2b$12$wmAorIYQNm2VYr24pF/9QOz9HwXNoa0rjo8dHZihbxPC19dcid1mG", userType=0)
    user.rooms.append(room)
    database.db_session.add(user)
    team.users.append(user)
    user = models.User(name="Emma", email="Emma@gmail.com", password="$2b$12$wmAorIYQNm2VYr24pF/9QOz9HwXNoa0rjo8dHZihbxPC19dcid1mG", userType=0)
    user.rooms.append(room)
    database.db_session.add(user)
    team.users.append(user)
    team.users.append(user)
    database.db_session.add(team)
    database.db_session.commit()

populate_db() # fill db with test user