from flask import Flask, request, jsonify, render_template, redirect, url_for, session
import mysql.connector
from functools import wraps
import secrets

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)

# Database connection
def get_db_connection():
    return mysql.connector.connect(
        host="dinedeal-db.cjs0ssiwsf2c.us-east-1.rds.amazonaws.com",
        user="admin",
        password="Vclass123$",
        database="dinedeal"
    )

# Login required decorator
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'logged_in' not in session:
            return redirect(url_for('admin_login'))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/')
def hello():
    return "Hello, World!"

@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username == 'admin' and password == 'Vclass123$':
            session['logged_in'] = True
            return redirect(url_for('admin_dashboard'))
        else:
            return "Invalid credentials", 401
    return render_template('admin_login.html')

@app.route('/admin/dashboard')
@login_required
def admin_dashboard():
    return render_template('admin_dashboard.html')

@app.route('/admin/update_restaurant', methods=['POST'])
@login_required
def update_restaurant():
    try:
        data = request.json
        restaurant_id = data['restaurant_id']
        
        db = get_db_connection()
        cursor = db.cursor()
        
        query = """
        UPDATE main_table 
        SET Restaurant_Name = %s, cost = %s, Item_description = %s 
        WHERE id = %s AND Item_Name = %s
        """
        cursor.execute(query, (
            data['restaurant_name'],
            data['cost'],
            data['item_description'],
            restaurant_id,
            data['item_name']
        ))
        
        if cursor.rowcount == 0:
            return jsonify({"message": "No matching restaurant and item found"}), 404
        
        db.commit()
        cursor.close()
        db.close()
        
        return jsonify({"message": f"Restaurant item updated successfully. Rows affected: {cursor.rowcount}"}), 200
    except mysql.connector.Error as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)