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
url = "https://www.kachigudajunction.ca/ottawa-menu/"
driver.get(url)

# Scroll down to the bottom of the page
driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
time.sleep(2)  # Allow time for lazy-loading

menu_items = driver.find_elements(By.XPATH, '//ul[@role="tablist"]/li')
menu_data = []
for menu_item in menu_items:
    menu_item.click()
    time.sleep(2)

    # Wait for the page to load completely
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, '//div[@class="tab-pane fade in active show"]//div[@class="margin-25px-tb padding-40px-lr sm-padding-30px-lr"]'))
    )

    # Get all the elements in Items identified by the specified XPath
    items = driver.find_elements(By.XPATH, '//div[@class="tab-pane fade in active show"]//div[@class="margin-25px-tb padding-40px-lr sm-padding-30px-lr"]')

    # Extract information and store it in a list of dictionaries
    for item in items:
        try:
            driver.execute_script("arguments[0].scrollIntoView(true);", item)
            time.sleep(0.5)

            item_name = item.find_element(By.XPATH, "./div/h6/span").text
            item_cost = item.find_element(By.XPATH, "./div/span").text
            item_description = ""
            # Check if a <p> element exists for item description
            description_elements = item.find_elements(By.XPATH, ".//p")
            if description_elements:
                item_description = description_elements[0].text

            # Append the extracted data to the list
            if item_name != "":
                menu_data.append({
                    "Restaurant_Name": "kachigudajunction",
                    "Item_Name": item_name,
                    "cost": item_cost,
                    "Item_description": item_description
                })
        except Exception as e:
            print(f"Error extracting data from item: {e}")

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

# Insert DataFrame into the kachiguda_menu table
try:
    df.to_sql("kachiguda_menu", con=engine, if_exists="append", index=False)  # Use "append" and a unique table name
    print("Data inserted successfully into kachiguda_menu.")
except Exception as e:
    print("An error occurred while inserting data:", e)
