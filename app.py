import os
import logging

from flask import Flask, render_template, send_from_directory, request, redirect, url_for, flash, jsonify, session
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from werkzeug.middleware.proxy_fix import ProxyFix
from werkzeug.security import generate_password_hash, check_password_hash


# Set up logging
logging.basicConfig(level=logging.DEBUG)

class Base(DeclarativeBase):
    pass


db = SQLAlchemy(model_class=Base)
# create the app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev_secret_key")
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)  # needed for url_for to generate with https

# Configure Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# configure the database, relative to the app instance folder
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL", "sqlite:///studyxchange.db")
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}
# initialize the app with the extension
db.init_app(app)

# User loader for Flask-Login
@login_manager.user_loader
def load_user(user_id):
    from models import User
    return User.query.get(int(user_id))

# Configure Flask to serve static files from the root directory
@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('.', filename)

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        from models import User
        
        user = User.query.filter_by(email=email).first()
        
        if user and user.check_password(password):
            login_user(user)
            session['user_type'] = user.user_type
            session['username'] = user.username
            
            next_page = request.args.get('next')
            if not next_page:
                if user.is_admin():
                    next_page = '/pages/admin-dashboard.html'
                else:
                    next_page = '/pages/profile.html'
            
            return redirect(next_page)
        
        flash('Invalid email or password')
        return redirect('/pages/login.html')
    
    return send_from_directory('pages', 'login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        user_type = request.form.get('user_type', 'buyer')
        
        from models import User
        
        if User.query.filter_by(username=username).first():
            flash('Username already exists')
            return redirect('/pages/register.html')
            
        if User.query.filter_by(email=email).first():
            flash('Email already registered')
            return redirect('/pages/register.html')
        
        new_user = User(username=username, email=email, user_type=user_type)
        new_user.set_password(password)
        
        db.session.add(new_user)
        db.session.commit()
        
        login_user(new_user)
        flash('Registration successful!')
        
        return redirect('/pages/profile.html')
    
    return send_from_directory('pages', 'register.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    session.pop('user_type', None)
    session.pop('username', None)
    return redirect('/')

@app.route('/api/user/current')
def get_current_user():
    if current_user.is_authenticated:
        return jsonify({
            'id': current_user.id,
            'username': current_user.username,
            'email': current_user.email,
            'user_type': current_user.user_type,
            'authenticated': True
        })
    return jsonify({'authenticated': False})

@app.route('/pages/<path:filename>')
def serve_pages(filename):
    return send_from_directory('pages', filename)

@app.route('/css/<path:filename>')
def serve_css(filename):
    return send_from_directory('css', filename)

@app.route('/js/<path:filename>')
def serve_js(filename):
    return send_from_directory('js', filename)

with app.app_context():
    try:
        # Import models
        import models  # noqa: F401
        # Create database tables
        db.create_all()
        
        # Create a default admin user if not exists
        from models import User
        admin = User.query.filter_by(email='admin@studyxchange.com').first()
        if not admin:
            admin = User(
                username='admin',
                email='admin@studyxchange.com',
                user_type='admin',
                location='StudyXchange HQ'
            )
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()
            app.logger.info("Default admin user created.")
            
        app.logger.info("Database tables created successfully.")
    except Exception as e:
        app.logger.error(f"Error creating database tables: {e}")