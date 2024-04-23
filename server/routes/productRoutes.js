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

router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error);
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

router.put('/:id', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
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
