from flask import Flask, request, jsonify, make_response
from flask_pymongo import PyMongo
import os
import json
from pymongo import MongoClient
import jwt
import datetime
from functools import wraps
from flask_cors import CORS
from functools import wraps
import pytz 
from dotenv import load_dotenv
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
app.config['SECRET_KEY'] =  app.secret_key = os.getenv('SECRET_KEY')  # Change this to a random secret key

# intialiazing mongodb client
load_dotenv()
print(os.getenv("MONGODB_URI"))
client = MongoClient(os.getenv('MONGODB_URI'))
db = client['dashboard']
collection = db['entries']

# this loads the jsondata into mongodb i have also ensured that the code only
# run once using if collection.count_documents({}) == 0

if collection.count_documents({}) == 0:
    # Get the directory of the current script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    # this line Construct the full path to the JSON file 
    json_file_path = os.path.join(script_dir, 'jsondata.json')
    # Open the JSON file with the correct encoding
    with open(json_file_path, encoding='utf-8') as f:
        data = json.load(f)
        collection.insert_many(data)

# this token_required function will be pass to every route that requires authentication 
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('x-access-token')
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            print(f"Token received: {token}")
            data = jwt.decode(token.strip('"'), app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = data['user']
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError as e:
            return jsonify({'message': 'Token is invalid!'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated


# this is the post requst route for logining 
@app.route('/login', methods=['POST'])
def login():
    auth = request.json
   
    if not auth or not auth.get('email') or not auth.get('password'):
        return make_response('Enter email and password', 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})
    
    username = auth.get('email')
    password = auth.get('password')

    # using a simple testign accout 
    if username == 'test@blackcoffer.com' and password == 'test1234':
        token = jwt.encode(
            {'user': username, 'exp': datetime.datetime.now(pytz.utc) + datetime.timedelta(minutes=30)},
            app.config['SECRET_KEY'], 
            algorithm="HS256"
        )
        return jsonify({'token': token})
    
    return make_response('Could not verify, invalid credentials', 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})



# this is just an intial request to the backend / page 
# not really using it in this project
@app.route('/')
def index():
    return 'This is the dashboard HTML'

# protected linechart post route, 
@app.route('/lineChart', methods=['POST'])
@token_required
def line_chart(current_user):
    try:
        # Get data from request body
        data = request.get_json()
        filters = data.get('filters', {})  # Default to empty dict if 'filters' not present
        
        selectedYAxisVariable = data.get("selectedYAxisVariable", {})
        selectedXAxisVariable = data.get("selectedXAxisVariable",{})
        query = {}

        # this if check ensures that only filters that have values are included in the query 
        # that will be use to fetch and filter data from the mongodb 
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
# using the mongodb aggregation pipeline to filter fetch data from mongodb
    pipeline = [
        {'$match': query},
        {'$group': {
            '_id': f'${selectedXAxisVariable}',
            'total_sum': {'$sum': f'${selectedYAxisVariable}'}
            
        }},
         {'$sort': {'_id': 1}}  # Sort by start_year
        
    ]
    data_cursor = collection.aggregate(pipeline)
    data_list = list(data_cursor)  

    # Preparing the response data
    response_data = {
        'labels': [item['_id'] for item in data_list],
        'data': [item['total_sum'] for item in data_list]
    }

    return jsonify(response_data)


from flask import request, jsonify
@app.route('/barchart', methods=['POST'])
@token_required
def barchart(current_user):
  try:
    # Get data from request body
    data = request.get_json()
    
    
    filters = data.get('filters', {})  # Default to empty dict if 'filters' not present
    selectedYAxisVariable = data.get("selectedYAxisVariable",{})
    selectedXAxisVariable = data.get("selectedXAxisVariable",{})
   
    query = {}
  
    # Only include filters that have values
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
    }},
    
  ]

  data_cursor = collection.aggregate(pipeline)
  data_list = list(data_cursor)  # Convert cursor to list

  # Preparing the response data
  response_data = {
    'labels': [item['_id'] for item in data_list],
    'data': [item['total_sum'] for item in data_list]
  }

  return jsonify(response_data)




if __name__ == "__main__":
    app.run(debug=True)
