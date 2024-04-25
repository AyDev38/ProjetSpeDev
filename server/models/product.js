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
      if (Array.isArray(images)) {
        this.setDataValue('images', images.join(';'));
      } else {
        this.setDataValue('images', images);
      }
    }
  }
}, {
  timestamps: true
});

module.exports = Product;
