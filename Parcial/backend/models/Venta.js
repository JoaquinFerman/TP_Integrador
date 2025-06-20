const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Venta = sequelize.define('Venta', {
    fecha: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cliente_nombre: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'Ventas',
    timestamps: false
  });

  return Venta;
};