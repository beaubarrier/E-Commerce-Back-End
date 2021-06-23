// import important parts of sequelize library
const { Model, DataTypes } = require('sequelize');
// import our database connection from config.js
const sequelize = require('../config/connection');

// Initialize Product model (table) by extending off Sequelize's Model class
class Product extends Model { }

// set up fields and rules for Product model
Product.init(
  {
    product_name: {
      field: 'product_name',
      type: Sequelize.STRING,
    },
    price: {
      field: 'price',
      type: Sequelize.DECIMAL
    },
    stock: {
      field: 'stock',
      type: Sequelize.INTEGER
    },
    category_id: {
      field: 'category_id',
      type: Sequelize.STRING
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product',
  }
);

module.exports = Product;
