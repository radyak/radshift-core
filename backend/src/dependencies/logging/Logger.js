const winston = require('winston')

Provider('Logger', () => {
    var logger = winston.createLogger({
        level: process.env.LOG_LEVEL || 'info',
        format: winston.format.simple(),
        transports: [
            new (winston.transports.Console)()
        ]
    });

    return logger
})