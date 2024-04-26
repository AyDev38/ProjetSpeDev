const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();
const authenticateToken = require('../utils/middleware')

// Inscription
router.post('/register', async (req, res) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 10);
        const user = await User.create({ username: req.body.username, password: hash });
        res.status(201).send(user);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
    }
);
  

// Connexion
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ where: { username: req.body.username } });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) {
            return res.status(401).send({ message: "Incorrect password" });
        }
        
        const token = jwt.sign(
            { userId: user.id }, // Payload contenant l'ID de l'utilisateur
            'your_secret_key',   // Secret pour signer le token
            { expiresIn: '1h' }  // Option pour définir la durée de vie du token
        );

        user.token = token;
        await user.save();
        
        // Ici commence la gestion du panier en session
        if (req.session.cart) {
            for (let item of req.session.cart) {
                const { productId, quantity } = item;
                await Cart.create({ userId: user.id, productId, quantity });
            }
            delete req.session.cart; // Videz le panier en session après la fusion
        }
        
        res.send({ token: token, message: "Logged in" });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});


// Route tableau de bord avec vérification du token
// router.get('/dashboard', authenticateToken, (req, res) => {
//     res.send({ message: "Dashboard" });
// });

router.get('/infos', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findByPk(userId);
        if (user) {
            const userInfo = {
                user
            };
            res.status(200).send(userInfo);
        } else {
            res.status(404).send({ message: "User not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});



// Déconnexion
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      res.status(400).send({ message: "Unable to log out" });
    } else {
        req.session = null;
        res.send({ message: "Logout successful" });
    }
  });
});

module.exports = router;
