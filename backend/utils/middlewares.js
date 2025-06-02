const { default: mongoose } = require('mongoose');
const morgan = require('morgan');
const logger = require('../utils/logger');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const config = require('../utils/config');

// This one logs any request made to the server
// One important thing to note. it only logs those request which have a response.
// No response indicates server error.
const morganRequestLogger = morgan((tokens, req, res) => {
    if (tokens.method(req, res) === 'POST') {
      return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        JSON.stringify(req.body),
      ].join(' ');
    }
  
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
    ].join(' ');
})

const handleDataBaseConnection = async (request, response, next) => {
  if (mongoose.connection.readyState !== 1) {
    return response.status(503).json({
      error: 'Database not connected',
    });
  }

   next();
};

// Because of time constraints I have not implemented 2 token strategy. using only access token for now not refresh token
const authenticateToken = async (request, response, next) => {
  const authHeader = request.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  const decodedToken = jwt.verify(token, config.TOKEN_SECRET);
  
  request.user = {
    id: decodedToken.id, 
    email: decodedToken.email, 
  };
  
  next();
};

const unknownEndpoint = async (request, response) => {
  response.status(404).send();
};

const errorHandler = async (error, request, response, next) => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  logger.debug(error.name);
  logger.debug(error.message);
  logger.debug(error);

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired. Please log in again.';
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid or missing authentication token.';
  }

  response.status(statusCode).json({ error: message });
};


module.exports = {
  morganRequestLogger,
  handleDataBaseConnection,
  errorHandler,
  unknownEndpoint,
  authenticateToken
}