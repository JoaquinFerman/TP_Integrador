const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SaleDetail = sequelize.define('SaleDetail', {
    id_sale: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_product: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: false
  });

  return SaleDetail;
};
