const { Sequelize } = require('sequelize');
const path = require('path');

const dbPath = path.resolve(__dirname, '../database/database.db');
console.log('Usando base de datos en:', dbPath);

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath
});

const User = require('./User')(sequelize);
const Product = require('./Product')(sequelize);
const Sale = require('./Sale')(sequelize);
const SaleDetail = require('./SaleDetail')(sequelize);

module.exports = {
  sequelize,
  User,
  Product,
  Sale,
  SaleDetail
};