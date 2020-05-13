from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from pathlib import Path

import logging
logger = logging.getLogger(__name__)

Path("./db/").mkdir(parents=True, exist_ok=True)
engine = create_engine('sqlite:///db/database.db', convert_unicode=True)
db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))
Base = declarative_base()
Base.query = db_session.query_property()

def init_db():
    import app.models
    Base.metadata.create_all(bind=engine)

def destroy_db():
    import app.models
    Base.metadata.drop_all(bind=engine)

def reset_db():
    import app.models
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)