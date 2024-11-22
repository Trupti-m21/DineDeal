import time

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

import pandas as pd
from sqlalchemy import create_engine

# Setup Selenium WebDriver
options = webdriver.ChromeOptions()
options.add_argument("start-maximized")  # Set the browser to start maximized (HD resolution)
driver = webdriver.Chrome(options=options)

# Base URL
base_url = "https://mannasfoods.ca/shop/page/"
menu_data = []

# Loop through pages 0 to 70
for page_num in range(1, 71):  # Inclusive of 70
    url = f"{base_url}{page_num}/"
    try:
        driver.get(url)

        # Wait until the products are loaded
        WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.XPATH, '//div[@class="row products columns-2"]/div/div/div[2]'))
        )

        # Locate the base element containing the products
        products = driver.find_elements(By.XPATH, '//div[@class="row products columns-2"]/div/div/div[2]')

        # Iterate over products and extract details
        for product in products:
            # Extract item name
            item_name = product.find_element(By.XPATH, './div/h2').text

            # Extract item cost
            item_cost = product.find_element(By.XPATH, './span/span/bdi').text

            # Print item details
            print(f"Page {page_num} - Item Name: {item_name}, Item Cost: {item_cost}")

            menu_data.append({
                "Restaurant_Name": "mannasfoods",
                "Item_Name": item_name,
                "cost": item_cost,
                "Item_description": "NA"
            })

    except Exception as e:
        # Log the error and continue
        print(f"Error on page {page_num}: {e}")
        continue

# Close the driver
driver.quit()

# Create a DataFrame from the data and display it
df = pd.DataFrame(menu_data)
print(df)

# Check the number of records loaded
print(f"Loaded {df.shape[0]} records.")
print("Columns in the DataFrame:", df.columns)

# Convert prices to numeric (remove '$' sign)
df['cost'] = pd.to_numeric(df['cost'].replace(r'[\$,]', '', regex=True), errors='coerce')

# Print the DataFrame before inserting into SQL
print("DataFrame to be inserted:")
print(df)

# Connect to the database
engine = create_engine("mysql+pymysql://admin:Vclass123$@dinedeal-db.cjs0ssiwsf2c.us-east-1.rds.amazonaws.com/dinedeal")

# Insert DataFrame into the mannasfoods_menu table
try:
    # Create the mannasfoods_menu table if it doesn't exist and insert the data
    df.to_sql("mannasfoods_menu", con=engine, if_exists="replace", index=False)
    print("Data inserted successfully into mannasfoods_menu.")
except Exception as e:
    print("An error occurred while inserting data:", e)
