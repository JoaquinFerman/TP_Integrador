const { Sequelize } = require('sequelize');
const path = require('path');

const dbPath = path.resolve(__dirname, '../database/database.db');
console.log('Usando base de datos en:', dbPath);

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath
});

const Usuario = require('./Usuario')(sequelize);
const Producto = require('./Producto')(sequelize);
const Venta = require('./Venta')(sequelize);
const DetalleVenta = require('./DetalleVenta')(sequelize);

module.exports = {
  sequelize,
  Usuario,
  Producto,
  Venta,
  DetalleVenta
};