# World Data Visualization

This project visualizes world data using a dynamic bubble chart. The data includes population, GDP, and other metrics over time.

## Prerequisites

Ensure you have the following software installed:
- Python 3.10 or later (64-bit)
- Git or GitHub Desktop

## Fresh Installation of Python 3.10 (64-bit)

### 1. Uninstall Previous Versions of Python

#### On Windows:

1. Open `Control Panel`.
2. Go to `Programs` > `Programs and Features`.
3. Locate any existing Python installations, select them, and click `Uninstall`.

#### On macOS:

1. Open `Terminal`.
2. Remove old Python versions:
   ```bash
   sudo rm -rf /Library/Frameworks/Python.framework/Versions/3.x
   sudo rm -rf "/Applications/Python 3.x"
   ```
3. Remove symbolic links:
   ```bash
   sudo rm /usr/local/bin/python3
   sudo rm /usr/local/bin/pip3
   ```

#### On Linux:

1. Open `Terminal`.
2. Remove old Python versions:
   ```bash
   sudo apt-get remove python3.x
   sudo apt-get purge python3.x
   ```

### 2. Install Python 3.10 (64-bit)

#### On Windows:

1. Download the Python 3.10 installer from the [official website](https://www.python.org/downloads/).
2. Run the installer.
3. Ensure you check the box `Add Python to PATH`.
4. Choose `Customize installation`, then `Next`.
5. Check the box `Install for all users`.
6. Finish the installation.

#### On macOS:

1. Download the Python 3.10 installer from the [official website](https://www.python.org/downloads/).
2. Run the installer and follow the instructions.

#### On Linux:

1. Open `Terminal`.
2. Update the package list:
   ```bash
   sudo apt-get update
   ```
3. Install Python 3.10:
   ```bash
   sudo apt-get install python3.10
   ```
4. Optionally, set Python 3.10 as the default Python version:
   ```bash
   sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.10 1
   ```

## Setup

### 1. Clone the repository using GitHub Desktop

1. Download and install GitHub Desktop from the [official website](https://desktop.github.com/).
2. Open GitHub Desktop and sign in to your GitHub account.
3. Click on `File` > `Clone Repository`.
4. In the `URL` tab, paste the repository URL: `https://github.com/yourusername/world-data-viz.git`.
5. Choose the local path where you want to clone the repository.
6. Click `Clone`.

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
On macOS and Linux:
```bash
source venv/bin/activate
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

By following these steps, you ensure a clean installation of Python 3.10 and set up the project without conflicts from previous Python versions.
