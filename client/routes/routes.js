const express = require('express');
const axios = require('axios');
const router = express.Router();

// URL de base pour le serveur back-end
const BASE_URL = 'http://localhost:5000/api/users';
const BASE_URL_PRODUCT = 'http://localhost:5000/api/products';

// Page d'accueil
router.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

// Inscription
router.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});

router.post('/register', async (req, res) => {
    try {
        const response = await axios.post(`${BASE_URL}/register`, req.body
        );
        res.redirect('/login');
    } catch (error) {
        console.error('Register error:', error);
        res.status(400).render('register', { message: 'Registration failed, please try again' });
    }
});

// Connexion
router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

router.post('/login', async (req, res) => {
    try {
        const response = await axios.post(`${BASE_URL}/login`, req.body);
        if (response.data.token) {
            // Stocker le JWT dans les cookies
            res.cookie('token', response.data.token, { httpOnly: true });
            req.session.token = response.data.token;
            res.redirect('/dashboard');
        } else {
            throw new Error('Token not provided');
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(400).render('login', { message: 'Login failed, please try again' });
    }
});

// Tableau de bord
router.get('/dashboard', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/dashboard`, {
            headers: { Authorization: `Bearer ${req.session.token}` }
        });
        res.render('dashboard', { title: 'Dashboard', data: response.data });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(401).redirect('/login');
    }
});


// Déconnexion
router.get('/logout', async (req, res) => {
    try {
        await axios.get(`${BASE_URL}/logout`, {
            headers: { Authorization: `Bearer ${req.session.token}` }
        });
        res.clearCookie('token');
        req.session.destroy();
        res.redirect('/login');
    } catch (error) {
        console.error('Logout error:', error);
        res.status(400).send('Failed to logout');
    }
});

// afficher les produits
router.get('/products', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL_PRODUCT}`);
        console.log(response.data);
        res.render('products', { title: 'Products', data: response.data });
    } catch (error) {
        console.error('Products error:', error);
        res.status(400).send('Failed to display products');
    }
}
);

// afficher un produit par son id
router.get('/products/:id', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL_PRODUCT}/${req.params.id}`);
        console.log(response.data);
        res.render('product', { title: 'Product', data: response.data });
    } catch (error) {
        console.error('Product error:', error);
        res.status(400).send('Failed to display product');
    }
}
);


module.exports = router;
