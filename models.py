from app import db
from flask_login import UserMixin
from datetime import datetime


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256))
    location = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    avatar = db.Column(db.String(255))  # Path to user avatar image
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    listings = db.relationship('Listing', backref='seller', lazy='dynamic')
    favorites = db.relationship('Favorite', backref='user', lazy='dynamic')
    sent_messages = db.relationship('Message', backref='sender', 
                                  foreign_keys='Message.sender_id', lazy='dynamic')
    received_messages = db.relationship('Message', backref='recipient', 
                                      foreign_keys='Message.recipient_id', lazy='dynamic')


class Listing(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text, nullable=False)
    condition = db.Column(db.String(20), nullable=False)
    category = db.Column(db.String(20), nullable=False)
    subcategory = db.Column(db.String(50))
    location = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    featured = db.Column(db.Boolean, default=False)
    views = db.Column(db.Integer, default=0)
    status = db.Column(db.String(20), default='active')  # active, sold, reserved
    
    # Book-specific details
    author = db.Column(db.String(100))
    publisher = db.Column(db.String(100))
    isbn = db.Column(db.String(20))
    publication_year = db.Column(db.Integer)
    edition = db.Column(db.String(20))
    page_count = db.Column(db.Integer)
    
    # Course-specific details
    course_code = db.Column(db.String(20))
    course_name = db.Column(db.String(100))
    university_specific = db.Column(db.Boolean, default=False)
    
    # Foreign Keys
    seller_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Relationships
    images = db.relationship('Image', backref='listing', lazy='dynamic', cascade='all, delete-orphan')
    favorites = db.relationship('Favorite', backref='listing', lazy='dynamic', cascade='all, delete-orphan')


class Image(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(200))
    file_size = db.Column(db.Integer)  # in bytes
    file_type = db.Column(db.String(50))  # MIME type
    is_primary = db.Column(db.Boolean, default=False)
    upload_date = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Foreign Keys
    listing_id = db.Column(db.Integer, db.ForeignKey('listing.id'), nullable=False)


class Favorite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Foreign Keys
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    listing_id = db.Column(db.Integer, db.ForeignKey('listing.id'), nullable=False)
    
    # Define a unique constraint to prevent duplicate favorites
    __table_args__ = (db.UniqueConstraint('user_id', 'listing_id'),)


class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    read = db.Column(db.Boolean, default=False)
    
    # Foreign Keys
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    recipient_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    listing_id = db.Column(db.Integer, db.ForeignKey('listing.id'))
    
    def __repr__(self):
        return f'<Message {self.id} from {self.sender_id} to {self.recipient_id}>'


class Conversation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user1_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user2_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    listing_id = db.Column(db.Integer, db.ForeignKey('listing.id'))
    last_message_time = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Define a unique constraint to prevent duplicate conversations
    __table_args__ = (db.UniqueConstraint('user1_id', 'user2_id', 'listing_id'),)


class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Integer, nullable=False)  # 1-5 stars
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Foreign Keys
    reviewer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    reviewed_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    listing_id = db.Column(db.Integer, db.ForeignKey('listing.id'), nullable=False)
    
    # Relationships
    reviewer = db.relationship('User', foreign_keys=[reviewer_id], backref='reviews_given')
    reviewed = db.relationship('User', foreign_keys=[reviewed_id], backref='reviews_received')
    
    # Define a unique constraint to prevent multiple reviews from same user for same listing
    __table_args__ = (db.UniqueConstraint('reviewer_id', 'listing_id'),)