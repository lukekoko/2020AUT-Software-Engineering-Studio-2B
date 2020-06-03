from app import app, models, schemas, database
from flask import jsonify, request
from typing import List
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity, jwt_refresh_token_required, create_refresh_token
)

import logging
logger = logging.getLogger(__name__)

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

@app.route('/teams', methods=['GET'])
@jwt_required
def getTeams():
    teamSchema = schemas.TeamSchema
    teams = models.Team.query.join(models.teamUsers).all()
    teamList = []
    for team in teams:
        teamList.append({
          'name': team.name,
          'leader': team.leaderId,
          'users': [{"id": user.id, "name": user.name, "email": user.email} for user in team.users],
          'tasks': [{"name": task.name, "desc": task.description} for task in team.tasks]
        })
        
    return jsonify(teamList), 200

# Post call to add teams to database
@app.route('/addTeams', methods=['POST'])
def addTeam():
    if request.method == 'POST':
        # get request data; name email password
        if not request.is_json:
            return jsonify({"msg": "Not a proper JSON"}), 400
        name = request.json.get('name')
        leaderId = request.json.get('leaderId')
        
        team = models.Team(name=name, leaderId=leaderId)
        try:
            database.db_session.add(team)
            database.db_session.commit()

            token = {
            'access_token': create_access_token(identity={'id': team.id, 'name': team.name, 'leaderId': team.leaderId}),
            }
        except Exception as e:
            print(e)
            return jsonify({"msg": "Cannot add team"}), 401
        return jsonify(token), 200
