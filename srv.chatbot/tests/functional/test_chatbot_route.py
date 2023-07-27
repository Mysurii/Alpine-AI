import pytest
import json

mimetype = 'application/json'
headers = {
      'Content-Type': mimetype,
      'Accept': mimetype
}

chatbot_uri = '/api/chatbot'

def test_train_without_query_params(client):
  response = client.post(f'{chatbot_uri}/train')  
  assert response.status_code == 400
  assert response.json['message'] == "Please provide the userid and chatbotid as query params"

def test_train_without_intents(client):
  response = client.post(f'{chatbot_uri}/train?userid=1&chatbotid=1')  
  assert response.status_code == 400
  assert response.json['message'] == "Please add some intents to the chatbot"

def test_response_without_query_params(client):
  response = client.post(f'{chatbot_uri}/response', data=json.dumps({"message": "hello"}), headers=headers)  
  assert response.status_code == 400
  assert response.json['message'] == "Please provide the userid and chatbotid as query params"

def test_response_without_intents(client):
  response = client.post(f'{chatbot_uri}/response?userid=1&chatbotid=1', data=json.dumps({"message": "hello"}), headers=headers)  
  assert response.status_code == 400
  assert response.json['message'] == "Please add some intents to the chatbot"


def test_response_without_message(client):
  response = client.post(f'{chatbot_uri}/response?userid=1&chatbotid=2', data=json.dumps({}), headers=headers)  
  assert response.status_code == 400
  assert response.json['message'] == "Please provide a message"  

def test_response_without_training(client):
  data = {'message': 'hello'}

  response = client.post(f'{chatbot_uri}/response?userid=1&chatbotid=2', data=json.dumps(data), headers=headers)  

  assert response.status_code == 404
  assert response.json['message'] == "File not found"  