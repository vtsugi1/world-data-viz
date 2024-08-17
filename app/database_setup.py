import sqlite3
import zipfile
import os
import csv

# Paths
db_file = 'app/static/data/games.db'
zip_file = 'app/static/data/steam-games-dataset.zip'
csv_file = 'app/static/data/steam-games-dataset.csv'

# Unzip the CSV file
with zipfile.ZipFile(zip_file, 'r') as zip_ref:
    zip_ref.extractall('app/static/data')

# Create SQLite database and table
conn = sqlite3.connect(db_file)
cursor = conn.cursor()

# Create the table with 39 columns
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
    Windows INTEGER,
    Mac INTEGER,
    Linux INTEGER,
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

# Read and insert the data into the SQLite database
with open(csv_file, newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    rows = [(row['AppID'], row['Name'], row['Release date'], row['Estimated owners'], row['Peak CCU'], row['Required age'],
             row['Price'], row['DLC count'], row['About the game'], row['Supported languages'], row['Full audio languages'],
             row['Reviews'], row['Header image'], row['Website'], row['Support url'], row['Support email'], row['Windows'],
             row['Mac'], row['Linux'], row['Metacritic score'], row['Metacritic url'], row['User score'], row['Positive'],
             row['Negative'], row['Score rank'], row['Achievements'], row['Recommendations'], row['Notes'], row['Average playtime forever'],
             row['Average playtime two weeks'], row['Median playtime forever'], row['Median playtime two weeks'], row['Developers'],
             row['Publishers'], row['Categories'], row['Genres'], row['Tags'], row['Screenshots'], row['Movies']) for row in reader]
    
    # Ensure each row has 39 values
    assert all(len(row) == 39 for row in rows)

    cursor.executemany('''
        INSERT INTO steam_games VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', rows)

# Commit and close the database connection
conn.commit()
conn.close()

# Remove the CSV file after loading into the database
os.remove(csv_file)

# Ensure the zip file is closed and then remove it
try:
    os.remove(zip_file)
except PermissionError:
    print(f"Could not remove {zip_file} because it is in use.")
