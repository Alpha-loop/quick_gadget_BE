const promBundle = require('express-prom-bundle');
const winston = require('winston');

module.exports = (app) => {
  // Metrics
  app.use(promBundle({
    includeMethod: true,
    includePath: true,
    metricsPath: '/metrics'
  }));

  // Logging
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'logs/combined.log' })
    ]
  });

  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple()
    }));
  }

  return logger;
};