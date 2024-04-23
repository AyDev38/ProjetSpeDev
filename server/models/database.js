const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: '../db/database.sqlite', // Make sure this path is correct relative to your project root
});

module.exports = sequelize;
