import pandas as pd

# Load the dataset
df = pd.read_csv('app/data/raw/world_bank_data.csv')

# Select relevant columns
df = df[['Time', 'Country Name', 'Country Code', 'GDP (current US$) [NY.GDP.MKTP.CD]', 'Population, total [SP.POP.TOTL]']]

# Rename columns for simplicity
df.columns = ['Year', 'Country', 'Country_Code', 'GDP', 'Population']

# Drop rows with missing values
df = df.dropna(subset=['GDP', 'Population'])

# Save the cleaned dataset
df.to_csv('app/data/cleaned_data.csv', index=False)