from flask import Flask, jsonify, request, abort
from .config.extensions import mongo
from .config.settings import MONGO_URI, ENVIRONMENT, PICKR_SERVER
from .controllers.chatbot import chatbot_bp
from .utils.exceptions import BaseError

def create_app(db_uri=MONGO_URI):
  app = Flask(__name__)
  app.config['MONGO_URI'] = db_uri

  mongo.init_app(app)

  app.register_blueprint(chatbot_bp)

  @app.before_request
  def allow_pickr_server_requests_only():
      if ENVIRONMENT == 'production' and request.remote_addr != PICKR_SERVER:
          abort(401)

  @app.errorhandler(BaseError)
  def handle_exception(err):
    response = {
      "error": err.error,
      "message": err.message
    }
    if len(err.args) > 0:
        response["message"] = err.args[0]
    return jsonify(response), err.status

  return app
