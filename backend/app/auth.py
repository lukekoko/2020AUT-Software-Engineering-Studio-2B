from app import app, models, schemas, database
from flask import jsonify, request
from typing import List
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity, jwt_refresh_token_required, create_refresh_token
)

import logging
logger = logging.getLogger(__name__)

bcrypt = Bcrypt(app)
jwt = JWTManager(app)


@app.route('/registration', methods=['POST'])
def register():
    """
    Registering a new user function
    inputs: json with name, email and password objects
    outputs: json with msg object and http code 401 or 200
    """
    if request.method == 'POST':
        # get request data; name email password
        if not request.is_json:
            return jsonify({"msg": "Not a proper JSON"}), 400
        name = request.json.get('name')
        email = request.json.get('email')
        password = request.json.get('password')
        userType = request.json.get('userType')
        # create password hash to store in db
        pw_hash = bcrypt.generate_password_hash(password).decode("utf-8")
        # store user data in db
        user = models.User(name=name, email=email, password=pw_hash, userType=userType)
        room = models.ChatRooms.query.filter_by(id=1).first()

        user.rooms.append(room)
        try:
            database.db_session.add(user)
            database.db_session.commit()
            token = {
            'access_token': create_access_token(identity={'id': user.id, 'name': user.name, 'email': user.email, 'userType': user.userType}),
            }
        except:
            return jsonify({"msg": "User with email already registered"}), 400
        return jsonify(token), 200
    return jsonify({"msg": "Not a proper JSON"}), 500

@app.route('/login', methods=['POST'])
def login():
    """
    User login and token generation
    inputs: json with email and password object
    outputs: json with access token and refresh token.
    """
    if request.method == 'POST':
        if not request.is_json:
            return jsonify({"msg": "Not a proper JSON"}), 400
        # get request data; email and password
        email = request.json.get('email')
        password = request.json.get('password')
        # # query database for user
        user = models.User.query.filter_by(email=email).first()
        if (user is None):
            return jsonify({"msg": "Wrong username or password"}), 401
        # check if password is correct
        if (bcrypt.check_password_hash(user.password, password)):
            # create jwt token and send
            access_token = create_access_token(identity=user.name)
            tokens = {
                'access_token': create_access_token(identity={'id': user.id, 'name': user.name, 'email': user.email, 'userType': user.userType}),
                'refresh_token': create_refresh_token(identity={'id': user.id, 'name': user.name, 'email': user.email, 'userType': user.userType})
            }
            return jsonify(tokens), 200
        else:
            return jsonify({"msg": "Wrong username or password"}), 401


@app.route('/refresh', methods=['POST'])
@jwt_refresh_token_required
def refresh():
    """
    Refresh JWT token if expired
    inputs: refresh token in Authorization header
    outputs: json with new access token.
    """
    current_user = get_jwt_identity()
    ret = {
        'access_token': create_access_token(identity=current_user)
    }
    return jsonify(ret), 200
