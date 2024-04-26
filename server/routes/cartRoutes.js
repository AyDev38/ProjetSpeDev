const express = require('express');
const Product = require('../models/product');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Cart = require('../models/cart');
const authenticateToken = require('../utils/middleware')


router.post('/add-to-cart', authenticateToken, async (req, res) => {
    try {
        const product = await Product.findByPk(req.body.productId);
        if (product) {
            let cart = await Cart.findOne({ where: { userId: req.user.userId } });
            if (!cart) {
                cart = await Cart.create({ userId: req.user.userId });
            }
            await cart.addProduct(product, { through: { quantity: req.body.quantity } });
            res.status(201).send({ message: 'Product added to cart.' });
        } else {
            res.status(404).send({ message: 'Product not found!' });
        }
    } catch (error) {
        res.status(500).send(error);
    }
}
);

router.get('/cart', authenticateToken, async (req, res) => {
    try {
        const cart = await Cart.findOne({ where: { userId: req.user.userId }, include: Product });
        if (cart) {
            res.status(200).send(cart);
        } else {
            res.status(404).send({ message: 'Cart not found!' });
        }
    } catch (error) {
        res.status(500).send(error);
    }
}
);

router.delete('/cart/:productId', authenticateToken, async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.productId);
        if (product) {
            const cart = await Cart.findOne({ where: { userId: req.user.userId } });
            if (cart) {
                await cart.removeProduct(product);
                res.status(200).send({ message: 'Product removed from cart.' });
            } else {
                res.status(404).send({ message: 'Cart not found!' });
            }
        } else {
            res.status(404).send({ message: 'Product not found!' });
        }
    } catch (error) {
        res.status(500).send(error);
    }
}
);

module.exports = router;