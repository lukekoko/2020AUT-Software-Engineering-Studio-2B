from flask_socketio import send, emit, join_room, leave_room
from flask import Flask, render_template
from app import app, socketio
from flask_jwt_extended import ( jwt_required )

messages = []

@socketio.on('connect')
@jwt_required
def connect():
    print('Client connected')

@socketio.on('disconnect')
def disconnect():
    print('Client disconnected')

@socketio.on('message')
@jwt_required
def handle_message(message):
    messages.append(message);
    emit('sentMessage', {'data': messages})

@socketio.on('join')
@jwt_required
def on_join(data):
    username = data['username']
    room = data['room']
    join_room(room)
    send(username + ' has entered the room: ' + room, room=room)

@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    send(username + ' has left the room: ' + room, room=room)

@socketio.on('sendMessage')
@jwt_required
def message(data):
    print(data)
    room = data['room']
    emit('roomMessage', {'username': data['username'], "message": data['message'], 'time': data['time']}, room=room)