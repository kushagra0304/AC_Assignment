// ---------------------------------------------------------
// NPM Packages

const express = require('express');
const { default: mongoose } = require('mongoose');
const cookieParser = require('cookie-parser');

// ---------------------------------------------------------
// My imports 

const config = require('./utils/config');
const authRouter = require('./controllers/auth');
const middlewares = require('./utils/middlewares');

// ---------------------------------------------------------
// Initialization

const app = express();

// ---------------------------------------------------------
// DB connection

app.use(middlewares.handleDataBaseConnection);

const url = config.MONGODB_URI;

console.log('Connecting to MongoDB');

mongoose.connect(url).then(async () => {
  console.log('Connection successfull to MongoDB');
}).catch((e) => {
  console.log('Error connecting to MongoDB:', e.message);
});

mongoose.Schema.Types.String.checkRequired(v => typeof v === 'string');
// ---------------------------------------------------------
// Middleware list

if (config.ENVIRONMENT === 'development') {
  app.use(require('./utils/middlewares').morganRequestLogger);
}

app.use(express.json());
app.use(cookieParser());

// Only contains login and signup, that is why before token verification
app.use('/auth', authRouter);

app.use(middlewares.authenticateToken)
// ----------------------------
// Controllers
app.use('/', authRouter);
// ----------------------------
// app.use(middlewares.unknownEndpoint);
app.use(middlewares.errorHandler); // this has to be the last loaded middleware.

// ---------------------------------------------------------
// Export express app

module.exports = app;

// ---------------------------------------------------------
