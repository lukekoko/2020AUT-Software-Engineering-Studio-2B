from flask import Flask
from app import app, models, schemas, database
from flask import jsonify, request
from typing import List
from flask_mail import Mail, Message
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity, jwt_refresh_token_required, create_refresh_token
)

import logging
logger = logging.getLogger(__name__)

# NB might need to enable less secure on google account to sign in
app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = '' #test email goes here 
app.config['MAIL_PASSWORD'] = "" #test password goes here
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
mail = Mail(app)


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
                            assignerID=assignerID,)
        try:
            for ID in assignedIDS:
                print(ID)
                user = models.User.query.filter_by(id=ID).first()
                user.tasks.append(task)
                database.db_session.add(user)
                # sendEmail(user.email) # This could be an easy way to send emails. As you have access to each users email.
            database.db_session.commit()  # SA will insert a relationship row
            sendEmail() #send email here..............................................................................
        except:
            return jsonify({"msg": "Cannot create Task"}), 500
        return jsonify({"msg": "Task Created"}), 200     



@app.route("/getCreatedTasks", methods=['POST'])
def getCreatedTasks():
    if request.method == 'POST':
        if not request.is_json:
            return jsonify({"msg": "Not a proper POST REQUEST"}), 400

        requestUserId = request.json.get('requestUserId')
        query = database.db_session.query(models.Tasks).filter(models.Tasks.assignerID == requestUserId).all()
        tasks = list()
        for createdTask in query:
            tasks.append({
                'id': createdTask.id,
                'name': createdTask.name,
                'title': createdTask.title,
                'description': createdTask.description,
                'assignerID': createdTask.assignerID,
            })
        return jsonify(tasks)


def sendEmail():                                   #this method also breaks CreateTask(). Receive "Create Task Error" when I click "submit" on create task page
   msg = Message('Hello', sender = 'fillthisbackinwithwhateveryouhadbefore', recipients = ['zain.salimuddin@student.uts.edu.au']) 
   msg.body = "Hello You have new tasks"
   mail.send(msg)
   return "Sent"

