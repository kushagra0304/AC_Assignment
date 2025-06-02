const crypto = require('crypto');

if(process.env.ENVIRONMENT === "development") {
  require('dotenv').config();
}

const generateTokenSecret = (length = 32) => {
  try {
    const buffer = crypto.randomBytes(length);
    return buffer.toString('hex');
  } catch (err) {
    console.log("Error generating token secret");
    throw err;
  }
};

const PORT = process.env.PORT || 10000;
const ENVIRONMENT = process.env.ENVIRONMENT;
const MONGODB_URI = ENVIRONMENT === "development" ? process.env.MONGODB_URI_DEV : process.env.MONGODB_URI_PROD;
const TOKEN_SECRET = process.env.TOKEN_SECRET || (ENVIRONMENT === "development" ? "ybhhufei7ghf7c7btv[=]'=[38hq" : generateTokenSecret());

module.exports = {
  MONGODB_URI,
  PORT,
  ENVIRONMENT,
  TOKEN_SECRET,
};
