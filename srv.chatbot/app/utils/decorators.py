from functools import wraps
from flask import request, abort
from .exceptions import BadRequest

def validateParams(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        userid = request.args.get('userid')
        chatbotid = request.args.get('chatbotid')

        if userid is None or chatbotid is None:
            raise BadRequest('Please provide the userid and chatbotid as query params')
        
        kwargs['userid'] = userid
        kwargs['chatbotid'] = chatbotid

        return fn(*args, **kwargs)
    return wrapper

def validateMessage(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        data = request.get_json()

        if data is None or data == {}:
            raise BadRequest('Please provide a message')

        message = data['message']

        if message == None or len(message) == 0: 
            raise BadRequest('Please provide a valid message')
        
        kwargs['message'] = message
        
        return fn(*args, **kwargs)
    return wrapper