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


@app.route('/createTask', methods=['POST'])
def CreateTask():
    if request.method == 'POST':
        if not request.is_json:
            return jsonify({"msg": "Not a proper JSON"}), 400

        print(request.json)

        name = request.json.get('name')
        title = request.json.get('title')
        description = request.json.get('description')
        assignerID = request.json.get('assignerID')
        assignedIDS = request.json.get('assignedIDS')

        print(name, title, description, assignerID, assignedIDS)

        # store user data in db
        task = models.Tasks(name=name, title=title, description=description,
                            assignerID=assignerID)
        try:
            for ID in assignedIDS:
                print(ID)
                user = models.User.query.filter_by(id=ID).first()
                # create associative object first
                usertasks = models.UserTask(user, task, 0, 0)
                user.tasks.append(usertasks)
                database.db_session.add(user)
            database.db_session.commit()  # SA will insert a relationship row
        except:
            return jsonify({"msg": "Cannot create Task"}), 500
        return jsonify({"msg": "Task Created"}), 200


@app.route("/getCreatedTasks", methods=['POST'])
def getCreatedTasks():
    if request.method == 'POST':
        if not request.is_json:
            return jsonify({"msg": "Not a proper POST REQUEST"}), 400

        requestUserId = request.json.get('requestUserId')
        query = database.db_session.query(models.Tasks).filter(
            models.Tasks.assignerID == requestUserId).all()
        tasks = list()
        for createdTask in query:
            hmQuery = database.db_session.query(models.UserTask).filter(
                models.UserTask.taskId == createdTask.id and models.Tasks.assignerID == requestUserId).first()
            tasks.append({
                'id': createdTask.id,
                'name': createdTask.name,
                'title': createdTask.title,
                'description': createdTask.description,
                'assignerID': createdTask.assignerID,
                'hours': hmQuery.hours,
                'minutes': hmQuery.minutes,

            })
        return jsonify(tasks)


@app.route("/getAssignedTasks", methods=['POST'])
def getAssignedTasks():
    if request.method == 'POST':
        if not request.is_json:
            return jsonify({"msg": "Not a proper POST REQUEST"}), 400

        requestUserId = request.json.get('requestUserId')
        query = database.db_session.query(models.UserTask).filter(
            models.UserTask.userId == requestUserId).all()

        tasks = list()
        for assignedTask in query:

            hmQuery = database.db_session.query(models.UserTask).filter(
                models.UserTask.taskId == assignedTask.taskId and models.UserTask.userId == requestUserId).first()

            assignedTaskQuery = database.db_session.query(models.Tasks).filter(
                models.Tasks.id == assignedTask.taskId).first()

            tasks.append({
                'id': assignedTaskQuery.id,
                'name': assignedTaskQuery.name,
                'title': assignedTaskQuery.title,
                'description': assignedTaskQuery.description,
                'assignerID': assignedTaskQuery.assignerID,
                'hours': hmQuery.hours,
                'minutes': hmQuery.minutes,
            })
        return jsonify(tasks)

# @app.route("/getAssignees", methods=['POST'])
# def getAssignees():
#     if request.method == 'POST':
#         if not request.is_json:
#             return jsonify({"msg": "Not a proper POST REQUEST"}), 400

#         taskID = request.json.get('taskID')

#         query = database.db_session.query(models.userTasks).filter(
#             models.userTasks.c.taskId == taskID).all()

#         tasks = list()
#         for user in query:
#             dbuser = database.db_session.query(models.User).filter(
#                 models.User.id == user.userId).first()
#             tasks.append({
#                 'id': dbtask.id,
#                 'name': dbtask.name,
#                 'title': dbtask.title,
#                 'description': dbtask.description,
#                 'assignerID': dbtask.assignerID,
#             })
#         return jsonify(tasks)


@app.route("/updateUserTaskHours", methods=['POST'])
def updateUserTaskHours():
    if request.method == 'POST':
        if not request.is_json:
            return jsonify({"msg": "Not a proper POST REQUEST"}), 400

        requestUserId = request.json.get('requestUserId')
        requestTaskId = request.json.get('requestTaskId')
        requestHours = request.json.get('requestHours')
        requestMinutes = request.json.get('requestMinutes')

        print("user " + str(requestUserId) + " task " + str(requestTaskId) +
              " hours " + str(requestHours) + " minutes " + str(requestMinutes))

        try:
            hmQuery = database.db_session.query(models.UserTask).filter(
                models.UserTask.taskId == requestTaskId and models.UserTasks.user == requestUserId).first()
            hmQuery.hours += int(requestHours)
            hmQuery.minutes += int(requestMinutes)

            if hmQuery.minutes >= 60:
                OFHours = hmQuery.minutes // 60  # Eg 5//2 = 2
                hmQuery.minutes = hmQuery.minutes % 60
                hmQuery.hours += OFHours

            database.db_session.commit()

            hm = list()
            hm.append({
                'hours': hmQuery.hours,
                'minutes': hmQuery.minutes,
            })
            return jsonify(hm)
        except:
            return jsonify({"msg": "Update User Task Error"}), 500
