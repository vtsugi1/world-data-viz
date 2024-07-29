from flask import Flask, jsonify, render_template, request
import pandas as pd
from transformers import GPTNeoForCausalLM, GPT2Tokenizer
import torch
from app import app

# Check if CUDA is available and set the device accordingly
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

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

@app.route('/bubble_chart')
def bubble_chart():
    return render_template('bubble_chart.html')

@app.route('/map_visualization')
def map_visualization():
    return render_template('map_visualization.html')

# Load the model and tokenizer
model_name = "EleutherAI/gpt-neo-1.3B"
tokenizer = GPT2Tokenizer.from_pretrained(model_name)
model = GPTNeoForCausalLM.from_pretrained(model_name).to(device)

@app.route('/generate_text', methods=['POST'])
def generate_text():
    data = request.json
    countries = data.get('countries', [])
    start_year = data.get('start_year')
    end_year = data.get('end_year')
    
    prompt = f"Provide an overview of the historical events, economic changes, and major developments in {', '.join(countries)} from {start_year} to {end_year}."
    
    # Set the pad token
    tokenizer.pad_token = tokenizer.eos_token
    
    inputs = tokenizer(prompt, return_tensors="pt", padding=True).to(device)
    inputs['attention_mask'] = torch.ones(inputs['input_ids'].shape, dtype=torch.long).to(device)
    
    outputs = model.generate(
        inputs['input_ids'], 
        attention_mask=inputs['attention_mask'], 
        max_length=500, 
        num_return_sequences=1,
        no_repeat_ngram_size=2,
        temperature=0.7,
        top_k=50,
        top_p=0.95,
        pad_token_id=tokenizer.eos_token_id
    )
    generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    
    return jsonify({'text': generated_text})

if __name__ == '__main__':
    app.run(debug=True)
