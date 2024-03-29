require("dotenv").config();

exports.config = {
  USER_DB: process.env.USER_DB,
  PASS_DB: process.env.PASS_DB,
  MONGO_URL: process.env.MONGO_URL,
  TOKEN_SECRET: process.env.TOKEN_SECRET,
  CLOUD_NAME: process.env.CLOUD_NAME,
  API_KEY: process.env.API_KEY,
  API_SECRET: process.env.API_SECRET,
};
