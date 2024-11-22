from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import pandas as pd
from sqlalchemy import create_engine

# Set up the Selenium WebDriver
options = webdriver.ChromeOptions()
options.add_argument("start-maximized")  # Set the browser to start maximized (HD resolution)
driver = webdriver.Chrome(options=options)

# Open the URL
url = "https://sardarji.net/#menu"
driver.get(url)

# Scroll down to the bottom of the page
driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
time.sleep(2)  # Allow time for lazy-loading

menu_items = driver.find_elements(By.XPATH, '//div[@class="menu-card hover:card"]/div')
menu_data = []

for menu_item in menu_items:
    item_name = menu_item.find_element(By.XPATH, "./div/h3/a").text
    item_cost = menu_item.find_element(By.XPATH, "./span").text
    item_description = ""

    # Append the extracted data to the list
    if "/" not in item_cost:
        menu_data.append({
            "Restaurant_Name": "sardarji",
            "Item_Name": item_name,
            "cost": item_cost,
            "Item_description": item_description
        })

# Create a DataFrame from the data and display it
df = pd.DataFrame(menu_data)
print(df)

# Close the browser
driver.quit()

# Check the number of records loaded
print(f"Loaded {df.shape[0]} records.")
print("Columns in the DataFrame:", df.columns)

# Convert prices to numeric (remove '$' sign)
df['cost'] = pd.to_numeric(df['cost'].replace(r'[\$,]', '', regex=True), errors='coerce')

# Print the DataFrame before inserting into SQL
print("DataFrame to be inserted:")
print(df)

# Connect to the database
engine = create_engine("mysql+pymysql://root:Shiva%40123@localhost/dinedeal")

# Insert DataFrame into the sardarji_menu table
try:
    df.to_sql("sardarji_menu", con=engine, if_exists="append", index=False)  # Use "append" to add new data
    print("Data inserted successfully into sardarji_menu.")

except Exception as e:
    print("An error occurred while inserting data:", e)
