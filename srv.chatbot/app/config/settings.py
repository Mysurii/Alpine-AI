import os
from dotenv import load_dotenv
load_dotenv()

MONGO_URI = os.environ.get("MONGO_URI")
MONGO_TEST_URI= os.environ.get("MONGO_TEST_URI")
PORT= os.environ.get('PORT')
ENVIRONMENT = os.environ.get('FLASK_ENVIRONMENT')
PICKR_SERVER = os.environ.get('PICKR_SERVER_URL') if ENVIRONMENT == 'production' else ''

if PICKR_SERVER is None:
  raise Exception('Pickr server URL is variable not defined!')

if PORT is None:
  raise Exception('PORT environment variable is not defined!')

if MONGO_URI is None or MONGO_TEST_URI is None:
  raise Exception("Please provide a mongo URI and the database name for development AND production")
