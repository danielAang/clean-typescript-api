export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/mp-database-mongo',
  port: process.env.PORT || 5050,
  jwtSecret: process.env.JWT_SECRET || 'd@3n!$$'
}
