const express = require('express');
const Product = require('../models/product');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Recode le get avec un search optionnel
router.get('/', async (req, res) => {
  try {
    const search = req.query.search;
    let products;
    if (search) {
      products = await Product.findAll({
        where: { libelle: search }
      });
    } else {
      products = await Product.findAll();
    }
    res.status(200).send(products);
  } catch (error) {
    res.status
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      res.status(200).send(product);
    } else {
      res.status(404).send({ message: 'Product not found!' });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// Middleware pour faire correspondre le token JWT envoyé par le client avec celui stocké dans la base de données
const authenticateToken = async (req, res, next) => {
  try {
      console.log(req.headers);
      const token = req.headers.authorization.split(' ')[1];
      const payload = jwt.verify(token, 'your_secret_key');
      console.log(payload);
      const user = await User.findByPk(payload.userId);
      if (user && user.token === token) {
          req.user = payload;
          next();
      } else {
          res.status(401).send({ message: "Unauthorized" });
      }
  } catch (error) {
      console.log(error);
      res.status(401).send({ message: "Unauthorized" });
  }
};

router.put('/:id', authenticateToken, async (req, res) => {
  try {
      const product = await Product.update(req.body, {
          where: { id: req.params.id }
      });
      if (product[0]) {
          res.status(200).send({ message: 'Product updated.' });
      } else {
          res.status(404).send({ message: 'Product not found!' });
      }
  } catch (error) {
      res.status(500).send(error);
  }
});

// Suppression d'un produit - Route protégée
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
      const deleted = await Product.destroy({
          where: { id: req.params.id }
      });
      if (deleted) {
          res.status(200).send({ message: 'Product deleted.' });
      } else {
          res.status(404).send({ message: 'Product not found!' });
      }
  } catch (error) {
      res.status(500).send(error);
  }
});

module.exports = router;
