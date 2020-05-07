#!/bin/bash
cd frontend
npm install
npm start & pids=$!
cd ..

cd backend
source venv/scripts/activate
python -m pip install -r requirements.txt
python run.py & pids+=" $!"

trap "kill $pids" SIGTERM SIGINT

wait $pids

