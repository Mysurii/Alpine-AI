### Setup virtual environment

**Skip this step if you already know how virutal environments work.**

1. Install an environment library if you don't have one. In this example we work with the 'virtualenv' library.

2. To install virtualenv, run the command:  *'pip install virtualenv'*

3. Make a virtual env with the following command: *'virtualenv venv python==3.10.5'*

4. Activate the environment: *'source venv/bin/activate'*

### Install dependencies
> To install the dependencies, just run 'pip install -e .'

### Set .env file
To make the server perform like it is supposed to, environment variables are required. To set this up create in the root of the project a file named ```.env```. Inside this file the following variables are required:
  - PORT={**Port for the server to run on**}
  - FLASK_APP={**Name of the app**}
  - FLASK_ENVIRONMENT={**Environment, for dev it is 'development'**}
  - MONGO_URI={**DATABASE CONNECTION URL. MOST OF THE TIME IT IS: mongodb://localhost:27017/**}
  - MONGO_TEST_URI={**DATABASE CONNECTION URL. MOST OF THE TIME IT IS: mongodb://localhost:27017/**}

### Running server

> flask run || python run.py  

### Testing

> python -m pytest
