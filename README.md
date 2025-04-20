# StudyXchange Platform

A platform for students to buy and sell study materials.

## Features

- User roles (Buyer, Seller, Admin)
- Study material listings
- Order management
- User dashboard
- Admin panel

## Local Development Setup

1. Clone the repository
```bash
git clone <repository-url>
cd studyxchange
```

2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables
Create a `.env` file in the backend directory with:
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

4. Start the development servers
```bash
# Start backend server
cd backend
npm start

# Start frontend server
cd ../StudentExchange
http-server -p 8080
```

## Deployment

### Backend (Render.com)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set environment variables:
   - `PORT`
   - `MONGODB_URI`
   - `JWT_SECRET`
4. Deploy

### Frontend (Netlify)
1. Create a new site on Netlify
2. Connect your GitHub repository
3. Set build settings:
   - Base directory: `StudentExchange`
   - Publish directory: `StudentExchange`
4. Deploy

## API Documentation

### Authentication Endpoints
- POST `/api/register` - Register a new user
- POST `/api/login` - Login user
- GET `/api/admin/dashboard` - Get admin dashboard data

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 