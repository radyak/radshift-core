const winston = require('winston')


var Logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.simple(),
    transports: [
        new (winston.transports.Console)()
    ]
});

module.exports = Logger