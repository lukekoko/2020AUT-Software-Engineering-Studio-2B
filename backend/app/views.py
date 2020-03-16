from app import app, models, schemas
from flask import jsonify
from typing import List

@app.route('/')
def index():
    userSchema = schemas.UserSchema
    users = models.User.query.all()
    return jsonify([userSchema.from_orm(user).dict() for user in users])