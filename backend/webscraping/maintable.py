from sqlalchemy import create_engine
import pandas as pd

# Connect to the database
engine = create_engine("mysql+pymysql://admin:Vclass123$@dinedeal-db.cjs0ssiwsf2c.us-east-1.rds.amazonaws.com/dinedeal")

# Example list of restaurant tables
restaurant_tables = ['mannasfoods_menu','sardarji_menu','kachiguda_menu','rajachettinad_menu']  # List of all restaurant tables

# Loop through each restaurant table and insert its data into the main table
for table in restaurant_tables:
    try:
        # Read the data from the restaurant-specific table
        df = pd.read_sql(f"SELECT * FROM {table}", con=engine)

        # Check if the DataFrame is empty before inserting
        if not df.empty:
            # Insert data into the main table (main_table)
            df.to_sql('main_table', con=engine, if_exists='append', index=False)
            print(f"Data from {table} inserted into main_table.")
        else:
            print(f"No data in {table} to insert.")
    except Exception as e:
        print(f"Error inserting data from {table}: {e}")
