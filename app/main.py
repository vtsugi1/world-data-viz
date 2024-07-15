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

@app.route('/countries')
def countries():
    df = pd.read_csv('app/data/cleaned_data.csv')
    countries = df['Country'].unique().tolist()
    return jsonify(countries)

@app.route('/years')
def years():
    df = pd.read_csv('app/data/cleaned_data.csv')
    years = df['Year'].unique().tolist()
    return jsonify(years)

@app.route('/')
def index():
    return render_template('index.html')
