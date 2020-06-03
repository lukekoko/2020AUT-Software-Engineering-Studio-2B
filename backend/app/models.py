from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.database import Base
from sqlalchemy.dialects.postgresql import ARRAY

import logging
logger = logging.getLogger(__name__)

userRooms = Table('userRooms', Base.metadata,
    Column('id', Integer, primary_key=True),
    Column('userId', Integer, ForeignKey('users.id')),
    Column('roomId', Integer, ForeignKey('ChatRooms.id')))

teamUsers = Table('teamUsers', Base.metadata,
    Column('teamId', Integer, ForeignKey('teams.id')),
    Column('userId', Integer, ForeignKey('users.id')))

teamTasks = Table('teamTasks', Base.metadata,
    Column('teamId', Integer, ForeignKey('teams.id')),
    Column('taskId', Integer, ForeignKey('tasks.id')))

class User(Base):
    __tablename__ = 'users'
    id =  Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    password = Column(String(100), unique=False, nullable=False)
    userType = Column(Boolean, unique=False, nullable=False)
    hourlyWage = Column(Float, unique=False, nullable=True)
    managerId = Column(Integer,unique=False, nullable=True)
    tasks = relationship("UserTask", back_populates='user')
    timesheets = relationship("Timesheet")
    rooms = relationship("ChatRooms", secondary=userRooms, back_populates='users')
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

class Team(Base):
    __tablename__ = 'teams'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)
    leaderId = Column(Integer)
    users = relationship("User", secondary=teamUsers)
    tasks = relationship("Tasks", secondary=teamTasks)

    def __init__(self, name=None, leaderId=None):
        self.name = name
        self.leaderId = leaderId

    def __repr__(self):
        return '<Team %r>' % (self.name)

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
    title = Column(String(150), nullable=False)
    description = Column(String(300), nullable=False)
    assignerID = Column(Integer, unique=False, nullable=True)
    users = relationship("UserTask", back_populates="tasks")

    def __init__(self, name=None, title=None, description=None, assignerID=None ):
            self.name = name
            self.title = title
            self.description = description
            self.assignerID = assignerID

class UserTask(Base):
    __tablename__ = 'userTasks'
    id = Column(Integer, primary_key=True)
    userId = Column(Integer, ForeignKey('users.id'))
    taskId = Column(Integer, ForeignKey('tasks.id'))
    hours = Column('hours', Integer, unique=False, nullable=False, default=0)
    minutes = Column('minutes', Integer, unique=False, nullable=False, default=0)
    user = relationship("User", back_populates='tasks')
    tasks = relationship("Tasks", back_populates='users')

    def __init__(self, user=None, tasks=None, hours=None, minutes=None):
        self.user = user
        self.tasks = tasks
        self.hours = hours
        self.minutes = minutes

class Log(Base):
    __tablename__ = 'logs'
    id = Column(Integer, primary_key=True)
    datetime = Column(DateTime, unique=True, nullable=False)

class ChatRooms(Base):
    __tablename__ = 'ChatRooms'
    id = Column(Integer, primary_key=True)
    name = Column(String(100), unique=True, nullable=False)
    roomName = Column(String(100), nullable=False)
    messages = relationship('Messages', backref='ChatRooms', passive_deletes=True)
    users = relationship('User', secondary=userRooms, back_populates='rooms')

class Messages(Base):
    __tablename__ = 'Messages'
    id = Column(Integer, primary_key=True)
    userId = Column(Integer, ForeignKey('users.id'), nullable=False)
    roomId = Column(Integer, ForeignKey('ChatRooms.id', ondelete='CASCADE'), nullable=False)
    time = Column(Integer, nullable=False)
    message = Column(String())
    removed = Column(Boolean, nullable=False)
    edited = Column(Boolean, nullable=False)

    def __repr__(self):
        return '<Message %r>' % (self.message)

class ToDo(Base):
    __tablename__='ToDo'
    id = Column(Integer, primary_key=True)
    taskName = Column(String(100), unique=True, nullable=False)
    description = Column(String(500))

    def __repr__(self):
        return '<taskName %r>' % (self.taskName)

class Doing(Base):
    __tablename__='Doing'
    id = Column(Integer, primary_key=True)
    taskName = Column(String(100), unique=True)
    description = Column(String(500))

    def __repr__(self):
        return '<taskName %r>' % (self.taskName)

class Done(Base):
    __tablename__='Done'
    id = Column(Integer, primary_key=True)
    taskName = Column(String(100), unique=True)
    description = Column(String(500))

    def __repr__(self):
        return '<taskName %r>' % (self.taskName)

