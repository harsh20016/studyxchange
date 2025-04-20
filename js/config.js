const config = {
    API_URL: process.env.NODE_ENV === 'production'
        ? 'https://studyxchange-backend.onrender.com/api'
        : 'http://localhost:5000/api'
};

export default config; 