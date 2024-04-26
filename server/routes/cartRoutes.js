const express = require('express');
const Product = require('../models/product');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Cart = require('../models/cart');
// const authenticateToken = require('../utils/middleware')


router.post('/add-to-cart', async (req, res) => {
    const isConnected = req.session.token ? true : false; // Vérifiez si l'utilisateur est connecté via un token en session
    const { productId, quantity } = req.body;

    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).send({ message: 'Product not found!' });
        }

        if (isConnected) {
            // L'utilisateur est connecté, stocker dans la BDD
            const userId = req.session.userId; // Assumez que l'ID utilisateur est stocké dans la session lors de la connexion
            const cart = await Cart.create({ userId, productId, quantity });
            res.status(201).send({ message: 'Product added to cart.' });
        } else {
            // L'utilisateur n'est pas connecté, stocker dans la session
            if (!req.session.cart) {
                req.session.cart = [];
            }
            req.session.cart.push({ productId, quantity });
            res.status(201).send({ message: 'Product added to cart in session.' });
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

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