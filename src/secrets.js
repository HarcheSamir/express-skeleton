const dotenv = require("dotenv");

const envFile = process.env.NODE_ENV === "docker" ? ".env.docker" : ".env.local";
dotenv.config({ path: envFile });

module.exports = {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
};
