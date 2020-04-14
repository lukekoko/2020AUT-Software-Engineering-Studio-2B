from flask_socketio import send, emit, join_room, leave_room
from flask import Flask, render_template
from app import app, socketio
from flask_jwt_extended import (
    JWTManager, jwt_required, get_jwt_identity
)

messages = []

@socketio.on('connect')
def test_connect():
    print('Client connected')

@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected')

@socketio.on('message')
def handle_message(message):
    messages.append(message);
    emit('sentMessage', {'data': messages})

@socketio.on('fetchMessages')
def handle_fetch():
    print('fetch')
    emit('initalMessages', {'data': messages})