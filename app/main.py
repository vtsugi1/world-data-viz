from flask import jsonify, render_template
import pandas as pd
from app import app

def get_data():
    df = pd.read_csv('app/data/cleaned_data.csv')
    return df.to_dict(orient='records')

@app.route('/data')
def data():
    data = get_data()
    return jsonify(data)

@app.route('/')
def index():
    return render_template('index.html')