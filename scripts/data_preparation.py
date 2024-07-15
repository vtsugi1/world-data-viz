import pandas as pd

# Load the dataset
df = pd.read_csv('app/data/raw/world_bank_data.csv')

# Select relevant columns
df = df[['Time', 'Country Name', 'Country Code', 'GDP (current US$) [NY.GDP.MKTP.CD]', 'Population, total [SP.POP.TOTL]', 'Military expenditure (% of GDP) [MS.MIL.XPND.GD.ZS]']]

# Rename columns for simplicity
df.columns = ['Year', 'Country', 'Country_Code', 'GDP', 'Population', 'Military_Expenditure']

# Drop rows with missing values
df = df.dropna(subset=['GDP', 'Population', 'Military_Expenditure'])

# Save the cleaned dataset
df.to_csv('app/data/cleaned_data.csv', index=False)
