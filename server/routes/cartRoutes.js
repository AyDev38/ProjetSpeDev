const express = require('express');
const Product = require('../models/product');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Cart = require('../models/cart');
// const authenticateToken = require('../utils/middleware')


router.post('/add-to-cart', async (req, res) => {
    console.log(req.body)
    try {
        const product = await Product.findByPk(req.body.productId);
        if (product) {
            // let cart = await Cart.findOne({ where: { userId: req.body.userId } });
            const cart = await Cart.create({ userId: req.body.userId, productId: req.body.productId, quantity: req.body.quantity  });
            // await cart.addProduct(product, { through: { quantity: req.body.quantity } });
            res.status(201).send({ message: 'Product added to cart.' });
        } else {
            res.status(404).send({ message: 'Product not found!' });
        }
    } catch (error) {
        res.status(500).send(error);
    }
}
);

router.get('/', async (req, res) => {
    try {
        const userId = req.query.userId;
        console.log(userId)
        const carts = await Cart.findAll({ where: { userId: userId }});
        if (carts) {
            for (const cart of carts) {
                const product = await Product.findByPk(cart.productId);
                cart.dataValues.product = product.dataValues;
            }
            res.status(200).send(carts);
        } else {
            res.status(404).send({ message: 'Cart not found!' });
        }
    } catch (error) {
        res.status(500).send(error);
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Cart.destroy({
          where: { id: req.params.id }
        });
        if (deleted) {
          res.status(200).send({ message: 'Product deleted to cart.' });
        } else {
          res.status(404).send({ message: 'Product not found!' });
        }
      } catch (error) {
        res.status(500).send(error);
      }
}
);

module.exports = router;