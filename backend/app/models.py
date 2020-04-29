from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.database import Base

userTasks = Table('userTasks', Base.metadata,
    Column('userId', Integer, ForeignKey('users.id')),
    Column('taskId', Integer, ForeignKey('tasks.id'))
)

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    password = Column(String(100), unique=False, nullable=False)
    userType = Column(Boolean, unique=False, nullable=False)
    hourlyWage = Column(Float, unique=False, nullable=True)
    managerId = Column(Integer, unique=False, nullable=True)
    tasks = relationship("Tasks", secondary=userTasks)
    timesheets = relationship("Timesheet")
    rooms = relationship("ChatRooms")
    messages = relationship("Messages")
    
    def __init__(self, name=None, email=None, password=None, userType=None, hourlyWage=None, managerId=None):
        self.name = name
        self.email = email
        self.password = password
        self.userType = userType
        self.hourlyWage = hourlyWage
        self.managerId = managerId

    def __repr__(self):
        return '<User %r>' % (self.name)

class Timesheet(Base):
    __tablename__ = 'timesheets'
    id = Column(Integer, primary_key=True)
    userId = Column(Integer, ForeignKey('users.id'), nullable=False)
    date = Column(DateTime, unique=True, nullable=False)
    hours = Column(Float, unique=False, nullable=False)

    def __init__(self, userId=None, date=None, hours=None):
        self.userId = userId
        self.date = date
        self.hours = hours

class Tasks(Base):
    __tablename__ = 'tasks'
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(String(300), nullable=False)

class Log(Base):
    __tablename__ = 'logs'
    id = Column(Integer, primary_key=True)
    datetime = Column(DateTime, unique=True, nullable=False)

class ChatRooms(Base):
    __tablename__ = 'ChatRooms'
    id = Column(Integer, primary_key=True)
    userId = Column(Integer, ForeignKey('users.id'), nullable=False)
    name = Column(String(100), nullable=False)
    messages = relationship('Messages')

class Messages(Base):
    __tablename__ = 'Messages'
    id = Column(Integer, primary_key=True)
    userId = Column(Integer, ForeignKey('users.id'), nullable=False)
    roomId = Column(Integer, ForeignKey('ChatRooms.id'), nullable=False)
    time = Column(Integer)
    message = Column(String(500))

    def __repr__(self):
        return '<Message %r>' % (self.message)
