import json
from pathlib import Path
from flask import Blueprint, request

from ..config.extensions import mongo
from ..utils.chatbot.Chatbot import Chatbot
from ..utils.exceptions import NotFound, BadRequest, ServerError
from ..utils.decorators import validateMessage, validateParams

chatbot_bp = Blueprint('chatbot_training_blueprint', __name__, url_prefix="/api/chatbot")

@chatbot_bp.route('/train', methods=['POST'] )
@validateParams
def training(**kwargs):
    userid = kwargs['userid']
    chatbotid = kwargs['chatbotid']
          
    intents = []

    try:      
      intents = get_intents(userid, chatbotid)
    except NotFound as not_found_err:
      raise not_found_err
    except BadRequest as bad_request:
      raise bad_request
    except Exception as e:
      print(e)
      raise ServerError()

    if len(intents) <= 0:
        raise BadRequest("No intents found")

    try:
      chatbot = Chatbot(chatbotid, intents)
      chatbot.train()
    except Exception as e:
      print(e)
      raise ServerError()
   
    
    return "Sucessfuly trained the chatbot.", 201


@chatbot_bp.route('/response', methods=['POST'])
@validateMessage
@validateParams
def get_response(**kwargs):
    userid = kwargs['userid']
    chatbotid = kwargs['chatbotid']
    message = kwargs['message']

    intents = []

    try:      
      intents = get_intents(userid, chatbotid)
    except NotFound as not_found_err:
      raise not_found_err
    except BadRequest as bad_request:
      raise bad_request
    except Exception as e:
      print(e)
      raise ServerError()

    if len(intents) <= 0:
      raise BadRequest()

    try:
      chatbot = Chatbot(chatbotid, intents)
      bot_response = chatbot.chatbot_response(message)
      return { "response": bot_response }, 200
    except NotFound as not_found_err:
      raise not_found_err
    except Exception as e:
        print(e)
        raise ServerError('Something went wrong while trying to train')


path = Path(__file__).parent / "../utils/intents/"
conversation_file = path / 'conversation.json'

def get_intents(userid: str, chatbotid: str) -> list:
  data = mongo.db.Users.find_one({'_id': userid}, {'_id': 0, 'chatbots': {'$elemMatch': {'_id': chatbotid}}})

  if data == None or data == {}:
    raise NotFound("No data found with the provided query")

  if not 'intents' in data['chatbots'][0]:
    raise BadRequest("Please add some intents to the chatbot")

  intents = data['chatbots'][0]['intents']

  if intents:  
    conversation_intents = json.loads(open(conversation_file).read())
    intents.extend(conversation_intents)

  return intents