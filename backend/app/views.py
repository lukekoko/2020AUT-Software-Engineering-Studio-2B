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

@app.route('/teams', methods=['GET'])
@jwt_required
def getTeams():
    teamSchema = schemas.TeamSchema
    teams = models.Team.query.with_entities(models.Team.id, models.Team.name).all()
    if (teams.__len__() == 0):
      teams = [createFakeTeam1(), createFakeTeam2(), createFakeTeam3()]
      print("ADDED FAKE TEAMS")

    print(teams)
    return jsonify([teamSchema.from_orm(team).dict() for team in teams])

def createFakeTeam1():
  team = models.Team()
  team.id = 1
  team.name = "Team One"
  team.leaderId = 1234
  print(team.id, team.name, team.leaderId)
  return team

def createFakeTeam2():
  team = models.Team()
  team.id = 2
  team.name = "Team Two"
  team.leaderId = 321
  print(team.id, team.name, team.leaderId)
  return team

def createFakeTeam3():
  team = models.Team()
  team.id = 3
  team.name = "Team Three"
  team.leaderId = 5467
  print(team.id, team.name, team.leaderId)
  return team