const express = require('express');
const Product = require('../models/product');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Cart = require('../models/cart');
const { Op } = require('sequelize');
const authenticateToken = require('../utils/middleware')

router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    console.error("Erreur lors de la création du produit:", error);
    res.status(400).send(error);
  }
});

router.get('/', async (req, res) => {
  try {
    const search = req.query.search;
    let products;
    if (search) {
      products = await Product.findAll({
        where: { libelle: { [Op.like]: '%' + search + '%' } }
      });
    } else {
      products = await Product.findAll();
    }

    res.status(200).send(products);
  } catch (error) {
    res.status(500).send("Une erreur s'est produite lors de la récupération des produits.");
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
