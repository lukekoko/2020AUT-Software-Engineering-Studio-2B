from app import app, socketio

# app.run(debug=True)
if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", debug=True)