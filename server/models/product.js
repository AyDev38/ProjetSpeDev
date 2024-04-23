const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const Product = sequelize.define('Product', {
  libelle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  prix: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  categorie: {
    type: DataTypes.STRING,
    allowNull: false
  },
  images: {
    type: DataTypes.STRING,
    get() {
      const rawValue = this.getDataValue('images');
      return rawValue ? rawValue.split(';') : [];
    },
    set(images) {
      this.setDataValue('images', images.join(';'));
    }
  }
}, {
  timestamps: true
});

module.exports = Product;
