import sqlite3
import pandas as pd
import os
import zipfile

# Define paths
csv_file = os.path.join('app', 'static', 'data', 'steam-games-dataset.csv')
zip_file = os.path.join('app', 'static', 'data', 'steam-games-dataset.zip')
database_file = os.path.join('app', 'static', 'data', 'games.db')

# Unzip the file if it existsif os.path.exists(zip_file):
with zipfile.ZipFile(zip_file, 'r') as zip_ref:
    zip_ref.extractall(os.path.join('app', 'static', 'data'))
    os.remove(zip_file)

# Load CSV into a DataFrameif os.path.exists(csv_file):
    df = pd.read_csv(csv_file)

    # Create SQLite database and connection
    conn = sqlite3.connect(database_file)
    cursor = conn.cursor()

    # Example schema creation
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS steam_games (
        AppID INTEGER PRIMARY KEY,
        Name TEXT,
        Release_date TEXT,
        Estimated_owners TEXT,
        Peak_CCU INTEGER,
        Required_age INTEGER,
        Price REAL,
        DLC_count INTEGER,
        About_the_game TEXT,
        Supported_languages TEXT,
        Full_audio_languages TEXT,
        Reviews TEXT,
        Header_image TEXT,
        Website TEXT,
        Support_url TEXT,
        Support_email TEXT,
        Windows BOOLEAN,
        Mac BOOLEAN,
        Linux BOOLEAN,
        Metacritic_score INTEGER,
        Metacritic_url TEXT,
        User_score REAL,
        Positive INTEGER,
        Negative INTEGER,
        Score_rank INTEGER,
        Achievements INTEGER,
        Recommendations INTEGER,
        Notes TEXT,
        Average_playtime_forever INTEGER,
        Average_playtime_two_weeks INTEGER,
        Median_playtime_forever INTEGER,
        Median_playtime_two_weeks INTEGER,
        Developers TEXT,
        Publishers TEXT,
        Categories TEXT,
        Genres TEXT,
        Tags TEXT,
        Screenshots TEXT,
        Movies TEXT
    )
    ''')

    # Insert the data into the database
    df.to_sql('steam_games', conn, if_exists='replace', index=False)

    # Commit changes and close the connection
    conn.commit()
    conn.close()

    # Optionally remove the CSV file after loading into the database
    os.remove(csv_file)
