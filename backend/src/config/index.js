module.exports = {
  mongoURI: process.env.MONGO_URI || 'mongodb://mongodb:27017/pickup-games',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
  jwtExpiration: process.env.JWT_EXPIRATION || '7d'
}; 