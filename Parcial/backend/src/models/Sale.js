const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Sale = sequelize.define('Sale', {
    date: {
      type: DataTypes.STRING,
      allowNull: false
    },
    client_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {
    timestamps: false
  });

  return Sale;
};