from flask import Flask, request, jsonify, make_response
from flask_pymongo import PyMongo
import os
import json
from pymongo import MongoClient
import jwt
import datetime
from functools import wraps
from flask_cors import CORS
import pytz
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Get the secret key and MongoDB URI from environment variables
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', "default_secret_key")
mongo_uri = os.getenv('MONGO_URI', "mongodb://localhost:27017/dashboard")

# Initializing MongoDB client
client = MongoClient(mongo_uri)
db = client['dashboard']
collection = db['entries']

# Load JSON data into MongoDB if the collection is empty
if collection.count_documents({}) == 0:
    script_dir = os.path.dirname(os.path.abspath(__file__))
    json_file_path = os.path.join(script_dir, 'jsondata.json')
    with open(json_file_path, encoding='utf-8') as f:
        data = json.load(f)
        collection.insert_many(data)

# Token required decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('x-access-token')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token.strip('"'), app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = data['user']
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

# Login route
@app.route('/login', methods=['POST'])
def login():
    auth = request.json
    if not auth or not auth.get('email') or not auth.get('password'):
        return make_response('Enter email and password', 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})

    username = auth.get('email')
    password = auth.get('password')

    # Simple testing account
    if username == 'test@blackcoffer.com' and password == 'test1234':
        token = jwt.encode(
            {'user': username, 'exp': datetime.datetime.now(pytz.utc) + datetime.timedelta(minutes=30)},
            app.config['SECRET_KEY'],
            algorithm="HS256"
        )
        return jsonify({'token': token})
    
    return make_response('Could not verify, invalid credentials', 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})

# Index route
@app.route('/')
def index():
    return 'This is the dashboard HTML'

# Line chart route
@app.route('/lineChart', methods=['POST'])
@token_required
def line_chart(current_user):
    try:
        data = request.get_json()
        filters = data.get('filters', {})
        selectedYAxisVariable = data.get("selectedYAxisVariable", {})
        selectedXAxisVariable = data.get("selectedXAxisVariable", {})
        query = {}

        if 'end_year' in filters and filters['end_year']:
            query['end_year'] = {'$lte': int(filters['end_year'])}
        if 'topics' in filters and filters['topics']:
            query['topic'] = filters['topics']
        if 'sector' in filters and filters['sector']:
            query['sector'] = filters['sector']
        if 'region' in filters and filters['region']:
            query['region'] = filters['region']
        if 'pestle' in filters and filters['pestle']:
            query['pestle'] = filters['pestle']
        if 'source' in filters and filters['source']:
            query['source'] = filters['source']
        if 'country' in filters and filters['country']:
            query['country'] = filters['country']
    except Exception as e:
        return jsonify({'error': 'Invalid request format'}), 400

    pipeline = [
        {'$match': query},
        {'$group': {
            '_id': f'${selectedXAxisVariable}',
            'total_sum': {'$sum': f'${selectedYAxisVariable}'}
        }},
        {'$sort': {'_id': 1}}
    ]
    data_cursor = collection.aggregate(pipeline)
    data_list = list(data_cursor)

    response_data = {
        'labels': [item['_id'] for item in data_list],
        'data': [item['total_sum'] for item in data_list]
    }

    return jsonify(response_data)

# Bar chart route
@app.route('/barchart', methods=['POST'])
@token_required
def barchart(current_user):
    try:
        data = request.get_json()
        filters = data.get('filters', {})
        selectedYAxisVariable = data.get("selectedYAxisVariable", {})
        selectedXAxisVariable = data.get("selectedXAxisVariable", {})
        query = {}

        if 'end_year' in filters and filters['end_year']:
            query['end_year'] = {'$lte': int(filters['end_year'])}
        if 'topics' in filters and filters['topics']:
            query['topic'] = filters['topics']
        if 'sector' in filters and filters['sector']:
            query['sector'] = filters['sector']
        if 'region' in filters and filters['region']:
            query['region'] = filters['region']
        if 'pestle' in filters and filters['pestle']:
            query['pestle'] = filters['pestle']
        if 'source' in filters and filters['source']:
            query['source'] = filters['source']
        if 'country' in filters and filters['country']:
            query['country'] = filters['country']
    except Exception as e:
        print(f"Error parsing request body: {e}")
        return jsonify({'error': 'Invalid request format'}), 400

    pipeline = [
        {'$match': query},
        {'$group': {
            '_id': f'${selectedXAxisVariable}',
            'total_sum': {'$sum': f'${selectedYAxisVariable}'}
        }}
    ]
    data_cursor = collection.aggregate(pipeline)
    data_list = list(data_cursor)

    response_data = {
        'labels': [item['_id'] for item in data_list],
        'data': [item['total_sum'] for item in data_list]
    }

    return jsonify(response_data)

if __name__ == "__main__":
    app.run(debug=True)
