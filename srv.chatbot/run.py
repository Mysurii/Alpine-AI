from app import create_app
from app.config.settings import PORT

if __name__ == "__main__":
 server = create_app()

 server.run(debug=True, host='0.0.0.0', port=PORT)