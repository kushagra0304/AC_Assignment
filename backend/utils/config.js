if(process.env.ENVIRONMENT === "development") {
  require('dotenv').config();
}

const PORT = process.env.PORT || 10000;
const ENVIRONMENT = process.env.ENVIRONMENT;
const MONGODB_URI = ENVIRONMENT === "development" ? process.env.MONGODB_URI_DEV : process.env.MONGODB_URI_PROD;
const TOKEN_SECRET = process.env.TOKEN_SECRET;

module.exports = {
  MONGODB_URI,
  PORT,
  ENVIRONMENT,
  TOKEN_SECRET,
};
