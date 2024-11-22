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
# Set up the Selenium WebDriver
options = webdriver.ChromeOptions()
options.add_argument("start-maximized")  # Set the browser to start maximized (HD resolution)
driver = webdriver.Chrome(options=options)

menu_data=[]
url = "https://www.rajachettinad.ca/takeaway-menu-2/"
driver.get(url)

try:
    # Wait for the complete page to load
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH,
                                        '//div[@class="swiper-menu-nav swiper-pagination-clickable swiper-pagination-bullets swiper-pagination-horizontal"]/span'))
    )

    # Get all navigation elements
    nav_elements = driver.find_elements(By.XPATH,
                                        '//div[@class="swiper-menu-nav swiper-pagination-clickable swiper-pagination-bullets swiper-pagination-horizontal"]/span')

    # Loop through each navigation element
    for index, nav_element in enumerate(nav_elements):
        try:
            # Click the navigation element
            nav_element.click()

            # Wait for the menu container to load
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located(
                    (By.XPATH, '//div[@class="container swiper-menu-container"]/div/div[2]'))
            )

            # Locate base elements
            base_elements = driver.find_elements(By.XPATH,
                                                 '//div[@class="swiper-slide swiper-slide-visible swiper-slide-active"]//div[@class="tst-menu-book-descr"]')

            # Extract details from each base element
            for base_element in base_elements:
                # Extract item name
                item_name = base_element.find_element(By.XPATH, './div/h5/a').text

                # Extract item description
                item_description = base_element.find_element(By.XPATH, './div/div').text

                # Extract item price
                item_price = base_element.find_element(By.XPATH,
                                                       './div//span[@class="woocommerce-Price-amount amount"]').text

                # Print the details
                print(f"Item Name: {item_name}")
                print(f"Item Description: {item_description}")
                print(f"Item Price: {item_price}")
                print('-' * 50)

                menu_data.append({
                    "Restaurant_Name": "RajaChettinad",
                    "Item_Name": item_name,
                    "cost": item_price,
                    "Item_description": item_description
                    
                })

        except Exception as e:
            print("Error:",e)
            continue

except Exception as e:
    print(f"Error on navigation element {index + 1}: {e}")


# Close the driver
driver.quit()

# Create a DataFrame from the data and display it
df = pd.DataFrame(menu_data)
print(df)

# Close the browser
driver.quit()

# Check the number of records loaded
print(f"Loaded {df.shape[0]} records.")
print("Columns in the DataFrame:", df.columns)


# # Convert prices to numeric (remove '$' sign)
df['cost'] = pd.to_numeric(df['cost'].replace(r'[\$,]', '', regex=True), errors='coerce')

# Print the DataFrame before inserting into SQL
print("DataFrame to be inserted:")
print(df)
#
# Connect to the database
engine = create_engine("mysql+pymysql://admin:Vclass123$@dinedeal-db.cjs0ssiwsf2c.us-east-1.rds.amazonaws.com/dinedeal")

# Insert DataFrame into the staging table
try:
    df.to_sql("rajachettinad_menu", con=engine, if_exists="replace", index=False)
    print("Data inserted successfully.")
except Exception as e:
    print("An error occurred while inserting data:",e)