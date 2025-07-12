
const { Sequelize } = require('sequelize');
require('dotenv').config();


// Install the appropriate database driver:
// Docs: https://sequelize.org/docs/v6/getting-started/
// npm install --save pg pg-hstore # Postgres
// npm install --save mysql2
// npm install --save mariadb
// npm install --save sqlite3
// npm install --save tedious # Microsoft SQL Server
// npm install --save oracledb # Oracle Database
const dbUrl = process.env.DB_URL || "postgres://user:pass@postgres:5432/admin_dashboard";


const sequelize = new Sequelize(dbUrl, {
  logging: console.log // maybe wll Winston
})

module.exports = sequelize