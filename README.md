# **DineDeal: Food Price Comparison Website**

DineDeal is a web application that allows users to search and compare food prices from various restaurants. Built using modern web technologies, DineDeal offers a fast, dynamic, and user-friendly experience for customers looking to make informed dining choices.

---

## **Project Overview**

The primary goal of DineDeal is to enable users to:

- Search for food items across multiple restaurants.
- Compare prices and make informed dining decisions.
- Securely log in using Google OAuth.
- Retrieve and manage food product data stored in a MySQL database hosted on AWS RDS.

---

## **System Flow and Architecture**

The system is designed with a clear separation of concerns between the frontend, backend, and database:

1. **Frontend**: Built with React.js, providing a dynamic user interface.
2. **Backend**: Developed using Node.js and Express.js, handling API requests and communicating with the database.
3. **Database**: A MySQL database hosted on AWS RDS, storing restaurant and food item details.

---

## **Technologies Used**

### **Frontend:**
- **React.js**: For building a dynamic and interactive user interface.
- **HTML/CSS**: For structuring and styling the web pages.
- **JavaScript**: For handling user interactions and sending API requests.
- **React Router**: For navigation between different views (e.g., Login, Search Results).

### **Backend:**
- **Node.js**: For handling server-side operations.
- **Express.js**: For routing and managing HTTP requests.
- **MySQL**: For storing and managing data, hosted on AWS RDS.
- **dotenv**: For managing environment variables securely.

### **Deployment:**
- **Amazon RDS**: Hosting the MySQL database with automated backups and scalability.

---

## **Key Features**

- **Search Functionality**: Users can search for food items and view real-time results.
- **Price Comparison**: Compare prices of food items across different restaurants.
- **Recently Viewed Search Terms**: Users can view their recently searched food items for quick access to previous searches.
- **Favorites Management**: Users can save their favorite food items for easy reference and comparison later.
- **Google OAuth Integration**: Secure user authentication and login to ensure data privacy.
- **Dynamic Data Rendering**: Real-time display of search results using React for a seamless user experience.

---

## **Getting Started**

### **Prerequisites**

Ensure the following are installed:

- [Node.js](https://nodejs.org/) (v14 or later)
- [MySQL](https://www.mysql.com/)
- [Git](https://git-scm.com/)

### **Installation**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Trupti-m21/DineDeal.git
   cd dinedeal
