# JuLe backend

## How to start

1. Install python3 with virtualenv

2. Open terminal inside the root project folder and type source env/bin/activate

3. ````
   $ export FLASK_APP=jule_backend_app.app:create_app
   $ export FLASK_ENV=development
   $ python -m flask run
   ````

## How to start on Windows

1. Install python3

2. Open terminal inside jule-backend

3. Run "py -3 -m venv venv" to create a virtual environment

4. Run "venv\Scripts\activate" to activate the environment

5. Run "pip install -r requirements.txt" to install the packages

6. Run '$env:FLASK_APP = "jule_backend_app.app:create_app"' and '$env:FLASK_ENV = "development"'

7. Run "flask run" to start

## REST API
### Tags
#### Get list of tags
#### Request
`GET /tags/`
#### Response
    TODO
### Get tag
#### Request
`GET /tags/<tag_id>`
#### Response
    TODO
