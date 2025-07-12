
const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbUrl = process.env.DB_URL || "postgres://user:pass@postgres:5432/admin_dashboard";


const sequelize = new Sequelize(dbUrl, {
  logging: console.log // maybe wll Winston
})

module.exports = sequelize