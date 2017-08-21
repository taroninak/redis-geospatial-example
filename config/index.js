const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    SERVER_PORT: process.env.PORT || 3000,
    SERVER_IP: process.env.IP || 'localhost',
    REDIS_URL: process.env.REDIS_URL || 'redis://localhost'
}