import os
import pytest

from app import create_app
from app.config.extensions import mongo
from app.config.settings import MONGO_TEST_URI

@pytest.fixture
def app():
    """Create and configure a new app instance for each test."""

    # create the app with common test config
    app = create_app(MONGO_TEST_URI)

    # buildup
    start_db()
    yield app

    # teardown
    clean_db()



@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()


@pytest.fixture
def runner(app):
    """A test runner for the app's Click commands."""
    return app.test_cli_runner()


def start_db():
  example_user = {"_id": "1", "name": "John Doe", "email": "johndoe@gmail.com", "password": "Hallo123%", "role": "user", "chatbots":[
    {
      "_id": "1",
      "name": "Eva",
      "description": "Virtual assistant"
    },
    {
      "_id": "2",
      "name": "Eva",
      "description": "Virtual assistant",
      "intents": [{
        "tag": "greeting",
        "patterns": ["Hello", "What is your name?"],
        "responses": [[{"type":"text", "text": "I am Eva!"}]]
      }]
    },

  ]}
  mongo.db.Users.insert_one(example_user)

def clean_db():
  try:
    mongo.db.drop_collection('Users')
  except:
    pass