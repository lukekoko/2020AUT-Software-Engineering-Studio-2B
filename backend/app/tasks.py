from app import app, models, schemas, database
from flask import jsonify, request
from typing import List
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity, jwt_refresh_token_required, create_refresh_token
)

bcrypt = Bcrypt(app)
jwt = JWTManager(app)


@app.route('/createTask', methods=['POST'])
def createTask():
  
    if request.method == 'POST':
        if not request.is_json:
            return jsonify({"msg": "Not a proper JSON"}), 400

        name = request.json.get('name')
        title = request.json.get('title')
        description = request.form.getlist('description[]')
        assignerID = request.json.get('assignerID')
        assignedIDS =  request.form.getlist('assignedIDS[]')

        # store user data in db
        task = models.Tasks(name=name, title=title, description=description, assignerID= assignerID, assignedIDS= assignedIDS)

        try:
            database.db_session.add(task)
            database.db_session.commit()
            
            for ID in assignedIDS:
              my_user = session.query(User).get(ID)
              my_user.tasks.append(task)
            session.commit() # SA will insert a relationship row

        except:
            return jsonify({"msg": "Cannot create Task"}), 401
        return jsonify({"msg": "Task Created"}),200