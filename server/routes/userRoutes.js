const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const router = express.Router();

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
        res.status(404).send({ message: "User not found" });
        } else {
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) {
            res.status(401).send({ message: "Incorrect password" });
        } else {
            console.log(req.session);
            req.session.userId = user.id;
            res.send({ message: "Logged in" });
        }
        }
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
    }
);

// Tableau de bord
router.get('/dashboard', async (req, res) => {
    if (req.session.userId) {
        const user = await User.findByPk(req.session.userId);
        res.send({ message: `Welcome ${user.username}!` });
    } else {
        res.status(401).send({ message: "Unauthorized" });
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
