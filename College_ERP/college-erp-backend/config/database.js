const { Sequelize } = require('sequelize');
require('dotenv').config();
console.log('DB_PASS:', JSON.stringify(process.env.DB_PASS), 'Type:', typeof process.env.DB_PASS);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false, // Set to true to see SQL queries
  }
);

module.exports = sequelize;

