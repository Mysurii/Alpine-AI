
from app.utils.chatbot.Chatbot import Chatbot
from app.utils.exceptions import NotFound
import pytest

intents = [{
        "tag": "name",
        "patterns": ["Who are you?", "What is your name?"],
        "responses": [[{"type":"text", "text": "Hai! I am a chatbot."}]]
      },
      {
        "tag": "leaving",
        "patterns": ["bye", "ciao", "goodbye"],
        "responses": [[{"type":"text", "text": "Have a great day!"}]]
      }]

default_chatbot = Chatbot('testing-01', intents)

def test_chatbot_training_with_empty_intents():
    chatbot = Chatbot('testing-02', [])

    isTrained = chatbot.train()


    assert isTrained == False

def test_chatbot_training_succesfully():
    isTrained = default_chatbot.train()

    assert isTrained == True

def test_chatbot_response_success():
    response = default_chatbot.chatbot_response('Who are you?')

    assert isinstance(response, list)
    assert isinstance(response[0], object)
    assert response[0]['text'] == "Hai! I am a chatbot."

def test_chatbot_response_different_order_should_give_correct_answer():
    response = default_chatbot.chatbot_response('Are you who?')

    assert isinstance(response, list)
    assert isinstance(response[0], object)
    assert response[0]['text'] == "Hai! I am a chatbot."

def test_chatbot_bow_not_trained():
    chatbot = Chatbot('testing-03', [])

    with pytest.raises(NotFound) as not_found:
        chatbot._bow('What is your name?')
    
    assert not_found.value.status == 404
    assert not_found.value.message == 'File not found'

def test_chatbot_prediction_not_trained():
    chatbot = Chatbot('testing-03', [])

    with pytest.raises(NotFound) as not_found:
        chatbot._predict_tag('What is your name?')
    
    assert not_found.value.status == 404
    assert not_found.value.message == 'File not found'
