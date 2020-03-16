# 2020AUT Software Studio 2B project

# Frontend

## steps to run

/On a seperate terminal/
* cd into __frontend__ folder
* run `npm install`
* run `npm start`
# Backend

## steps to run

* Ensure python 3.8 and pip is installed
* Install virtualenv `pip install virtualenv`
* cd into __backend__ folder
* run `python -m virtualenv venv`
* activate virtual environment
  * __Windows__
    If activating from bash(default vscode terminal), you'll first have to enter Command Prompt mode by entering: `cmd`,
    then type `venv\Scripts\activate`. Otherwise if you're already using Command Prompt, just directly type in `venv\Scripts\activate`.
  * __Linux__ - `source /venv/bin/activate`
* Install packages `pip install -r requirements.txt`
* run backend `python run.py`