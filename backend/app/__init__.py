from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from app import database

app = Flask(__name__)
CORS(app)
app.config.from_object('config')

database.init_db()

@app.teardown_appcontext
def shutdown_session(exception=None):
    database.db_session.remove()


from app import views, models

# test1 = models.User('Test1', 'test1@localhost')
# test2 = models.User('Test2', 'test2@localhost')
# test3 = models.User('Test3', 'test3@localhost')
# database.db_session.add(test1)
# database.db_session.add(test2)
# database.db_session.add(test3)
# database.db_session.commit()