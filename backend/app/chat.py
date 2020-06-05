from flask_socketio import send, emit, join_room, leave_room, close_room
from flask import Flask, render_template, jsonify, request
from app import app, socketio, models, schemas, database
from flask_jwt_extended import ( jwt_required, get_jwt_identity )
from collections import deque

import logging
logger = logging.getLogger(__name__)

messages = []

@socketio.on('connect')
# @jwt_required
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
    # get messages from db
    username = data['username']
    room = data['room']
    join_room(room)
    send(username + ' has entered the room: ' + str(room), room=room)
    emit('success', {'userid': data['userid'] }, room=room)

@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    send(username + ' has left the room: ' + str(room), room=room)

# messages from rooms
@socketio.on('sendMessage')
@jwt_required
def message(data):
    # store message in db
    user = models.User.query.filter_by(id=data['userid']).first()
    room = models.ChatRooms.query.filter_by(id=data['room']).first()
    message = models.Messages(time=data['time'], message=data['message'], removed=False, edited=False)

    room.messages.append(message)
    user.messages.append(message)
    database.db_session.add(room)
    database.db_session.add(user)
    database.db_session.commit()

    sendMessage = {
        'id': message.id,
        'userId': user.id,
        'roomId': message.roomId,
        'username': user.name,
        'time': message.time,
        'message': message.message,
        'removed': message.removed,
        'edited': message.edited
    }
    emit('roomMessage', sendMessage, room=data['room'])


# creating rooms
@app.route('/rooms', methods=['post'])
@jwt_required
def createRoom():
    if (request.method == 'POST'):
        if not request.is_json:
            return jsonify({"msg": "Not a proper JSON"}), 400
        current_user = get_jwt_identity()
        currentUser = models.User.query.filter_by(id=current_user['id']).first()
        # get users from database who want to be connected
        filteredUsers = (models.User.query.filter(models.User.id.in_(request.json.get('users'))).all()) 
        filteredUsers.insert(0, currentUser)
        # check if users already have a room
        userNames = []
        for i in filteredUsers:
            userNames.append(i.name)
        testUsers = deque(userNames)
        for i in range(len(testUsers)):
            duplicateRoomName = ', '.join(testUsers)
            testUsers.rotate(1)
            roomFound = models.ChatRooms.query.filter_by(name=duplicateRoomName).first()
            if (roomFound):
                print(duplicateRoomName)
                return jsonify({"msg": "Room already made"}), 400
            
        # creating room name
        roomname = ', '.join(userNames)
        # adding room to users
        try:
            room = models.ChatRooms(name=roomname, roomName=roomname)
            # add rooms to users
            for user in filteredUsers:
                user.rooms.append(room)
                database.db_session.add(user)
            database.db_session.commit()
            socketio.emit('roomCreated')
            return jsonify({"msg": "Room Created"}), 200
        except Exception as e:
            return jsonify({"msg": "error"}), 400
    return jsonify({"msg": "error"}), 400

# getting rooms
@app.route('/rooms', methods=['GET'])
@jwt_required
def getRooms():
    roomSchema = schemas.RoomSchema
    # get user that is requesting rooms
    current_user = get_jwt_identity()
    rooms = models.users = models.ChatRooms.query.join(models.userRooms).filter_by(userId=current_user['id']).all()
    return jsonify([roomSchema.from_orm(room).dict() for room in rooms])

@app.route('/rooms/messages', methods=['POST'])
@jwt_required
def getRoomMessages():
    roomid = request.json.get('room')
    if (request.method == 'POST'):
        if not request.is_json:
            return jsonify({"msg": "Not a proper JSON"}), 400
    previousMessages = []
    query = database.db_session.query(models.Messages, models.User).filter(models.Messages.roomId == roomid).filter(models.Messages.userId == models.User.id).all()
    for message in query:
        previousMessages.append({
            'id': message[0].id,
            'userId': message[0].userId,
            'roomId': message[0].roomId,
            'username': message[1].name,
            'time': message[0].time,
            'message': message[0].message,
            'removed': message[0].removed,
            'edited': message[0].edited
        })
    return jsonify(previousMessages), 200

@app.route('/rooms/users', methods=['POST'])
@jwt_required
def getUsersThatAreNotInRoomsTogether():
    userid = request.json.get('userid')
    userSchema = schemas.UserSchema
    users = models.User.query.with_entities(models.User.id, models.User.name, models.User.email).all()
    return jsonify([userSchema.from_orm(user).dict() for user in users])


@app.route('/rooms/messages/delete', methods=['POST'])
@jwt_required
def deleteMessage():
    id = request.json['id']
    message = models.Messages.query.filter_by(id=id).first()
    userids = getUsersFromRoom(message.roomId)
    try:
        message.message = "Removed"
        message.removed = True
        database.db_session.commit()
        socketio.emit('successMessage', {'userid': userids }, room=request.json['room'])
    except:
        return jsonify({"msg": "error"}), 400
    return jsonify({"msg": "Message deleted"}), 200


@app.route('/rooms/messages/edit', methods=['POST'])
@jwt_required
def editmessage():
    id = request.json['id']
    message = models.Messages.query.filter_by(id=id).first()
    userids = getUsersFromRoom(message.roomId)
    try:
        message.message = request.json['message']
        message.edited = True
        database.db_session.commit()
        socketio.emit('successMessage', {'userid': userids }, room=request.json['room'])
    except:
        return jsonify({"msg": "error"}), 400
    return jsonify({"msg": "Message edited"}), 200

@app.route('/rooms/delete', methods=['POST'])
@jwt_required
def deleteRoom():
    id = request.json['roomid']
    room = models.ChatRooms.query.filter_by(id=id).first()
    socketio.close_room(room.name)
    userids = getUsersFromRoom(id)
    try:
        messages = models.Messages.query.filter(models.Messages.roomId == id).delete()
        database.db_session.delete(room)
        database.db_session.commit()
        socketio.emit('successRoom', {'userid': userids, 'method': 'delete' })
    except:
        return jsonify({"msg": "error"}), 400
    return jsonify({"msg": "Message deleted"}), 200

@app.route('/rooms/edit', methods=['POST'])
@jwt_required
def editRoom():
    id = request.json['roomid']
    room = models.ChatRooms.query.filter_by(id=id).first()
    userids = getUsersFromRoom(id)
    try:
        room.roomName = request.json['name']
        database.db_session.commit()
        socketio.emit('successRoom', {'userid': userids, 'method': 'edit' })
    except:
        return jsonify({"msg": "error"}), 400
    return jsonify({"msg": "Message deleted"}), 200


def getUsersFromRoom(roomid):
    # get users from roomid
    useridArr = []
    users = models.User.query.filter(models.User.rooms.any(id=roomid)).all()
    for user in users:
        useridArr.append(user.id)
    return useridArr