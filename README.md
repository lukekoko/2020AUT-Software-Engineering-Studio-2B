# 2020AUT Software Studio 2B project

# Frontend

## steps to run
* Install node.js LTS version https://nodejs.org/en/

* cd into __frontend__ folder
* run `npm install`
* run `npm start`
# Backend

## steps to run

On a seperate terminal
* Ensure python 3.8 64 bit and pip is installed
* Install virtualenv `pip install virtualenv`
* cd into __backend__ folder
* run `python -m venv venv`
* activate virtual environment
  * __Windows__
    If activating from bash(default vscode terminal), you'll first have to enter Command Prompt mode by entering: `cmd`,
    then type `venv\Scripts\activate`. Otherwise if you're already using Command Prompt, just directly type in `venv\Scripts\activate`.
  * __Linux__ - `source /venv/bin/activate`
* Install packages `pip install -r requirements.txt`
* run backend `python run.py`

# Docker
If you want to use docker this is how.
* change url in chat.js line 49 to "http://backend:5000"
* change url in package.json line 5 to "http://backend:5000"
* ensure docker and docker-compose is installed
* cd into root directory
* run `docker-compose build`
* run `docker-compose up` 

# Bash
If you want to use bash script to launch project
* cd into root directory
* run `bash build.sh`

# Common problems
## Errors when pulling new changes or changing branches
* Try to update packages for both python and react
  * __Frontend__ - npm install
  * __Backend__ - pip install -r requirements.txt

## Errors when trying to push to github
* Ensure that you have been given access to the github

## Database errors
* Try to delete the current database file.
  * stop backend
  * delete database.db
  * start backend
  
* Alternate: go to __init__.py 
  * stop backend
  * comment database.init_db()
  * uncomment database.reset_db()
  * uncomment populate_db()
  * start backend
  * if works revert the changes above
