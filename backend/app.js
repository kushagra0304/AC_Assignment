// ---------------------------------------------------------
// NPM Packages

const express = require('express');
const { default: mongoose } = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// ---------------------------------------------------------
// My imports 

const config = require('./utils/config');
const authRouter = require('./controllers/auth');
const postRouter = require('./controllers/post');
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

// ----------------------------
// Cors setup

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://ac-assignment.vercel.app'
  ],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// ----------------------------
// Controllers

app.use('/', authRouter);
app.use('/', postRouter)

// ----------------------------
// app.use(middlewares.unknownEndpoint);
app.use(middlewares.errorHandler); // this has to be the last loaded middleware.

// ---------------------------------------------------------
// Export express app

module.exports = app;

// ---------------------------------------------------------