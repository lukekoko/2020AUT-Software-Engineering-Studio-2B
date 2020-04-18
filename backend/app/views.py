from app import app, models, schemas, database
from flask import jsonify
from typing import List
from flask_jwt_extended import (
    JWTManager, jwt_required, get_jwt_identity
)

@app.route('/')
def index():
    """
    Sample route for getting user data
    inputs: json with email and password object
    outputs: json with access token and refresh token.
    """
    userSchema = schemas.UserSchema
    users = models.User.query.with_entities(models.User.id, models.User.name, models.User.email, models.User.userType).all()
    print(users)
    return jsonify([userSchema.from_orm(user).dict() for user in users])


@app.route('/protected', methods=['GET'])
@jwt_required
def protected():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    return jsonify(current_user), 200

@app.route('/users', methods=['GET'])
@jwt_required
def getUsers():
    userSchema = schemas.UserSchema
    users = models.User.query.with_entities(models.User.id, models.User.name, models.User.email, models.User.userType).all()
    print(users)
    return jsonify([userSchema.from_orm(user).dict() for user in users])