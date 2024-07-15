# World Data Visualization

This project visualizes world data using a dynamic bubble chart. The data includes population, GDP, and other metrics over time.

## Prerequisites

Ensure you have the following software installed:
- Python 3.10 or later
- Git

## Setup

### 1. Clone the repository

Open a terminal or PowerShell and run:
```bash
git clone https://github.com/yourusername/world-data-viz.git
cd world-data-viz
```

### 2. Create a virtual environment

In the project directory, create a virtual environment:
```bash
python -m venv venv
```

### 3. Activate the virtual environment

Activate the virtual environment:
On Windows:
```bash
venv\Scripts\activate
```

### 4. Install the dependencies

With the virtual environment activated, install the required dependencies:
```bash
pip install -r requirements.txt
```

### 5. Prepare the data

Run the data preparation script to clean and prepare the dataset:
```bash
python scripts/data_preparation.py
```

### 6. Run the Flask app
Start the Flask development server:

```bash
flask run
```

