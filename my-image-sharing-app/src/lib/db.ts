import { Sequelize } from 'sequelize';
const mysql2 = require('mysql2'); // Explicitly require mysql2

// Initialize Sequelize with MySQL settings
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE || 'your-database',
  process.env.MYSQL_USER || 'your-username',
  process.env.MYSQL_PASSWORD || 'your-password',
  {
    host: process.env.MYSQL_HOST || 'localhost',
    dialect: 'mysql',
    dialectModule: mysql2, // Ensure the correct MySQL dialect module is used
  }
);

// Ensure Sequelize connection
export async function dbConnect() {
  try {
    await sequelize.authenticate(); // Check the connection
    console.log('Connection to MySQL has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
}

export default sequelize;