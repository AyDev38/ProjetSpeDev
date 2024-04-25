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

// axios.post(...)
//   .then(() => res.redirect('/login'))
//   .catch(err => ...); 

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
        // const response = await axios.get(`${BASE_URL}/dashboard`, {
        //     headers: { Authorization: `Bearer ${req.session.token}` }
        // });
        const infosUser = await axios.get(`${BASE_URL}/infos`, {
            headers: { Authorization: `Bearer ${req.session.token}` }
        });
        res.render('dashboard', { title: 'Dashboard', user: infosUser.data.user });
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

// afficher les produits avec un search optionnel
router.get('/products', async (req, res) => {
    try {
        const search = req.query.search;
        let response;
        if (search) {
            response = await axios.get(`${BASE_URL_PRODUCT}?search=${search}`);
        } else {
            response = await axios.get(`${BASE_URL_PRODUCT}`);
        }
        // console.log("response:", response.data)
        res.render('products', { title: 'Products', data: response.data });
    } catch (error) {
        console.error('Products error:', error);
        res.status(400).send('Failed to display products');
    }
});

// afficher un produit par son id
router.get('/products/:id', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL_PRODUCT}/${req.params.id}`);
        // console.log(response.data);
        res.render('product', { title: 'Product', data: response.data });
    } catch (error) {
        console.error('Product error:', error);
        res.status(400).send('Failed to display product');
    }
});

//add prodcut 
router.get('/add-product', async (req, res) => {
    res.render('add-product');
});

router.post('/add-product', async (req, res) => {
    // console.log(req.body)
    req.body.createdAt = new Date();
    req.body.updatedAt = new Date();

    // Convertir le prix en nombre
    req.body.prix = parseFloat(req.body.prix);

    try {
        const response = await axios.post(`${BASE_URL_PRODUCT}`, req.body, {
            headers: { Authorization: `Bearer ${req.session.token}` }
        });
        res.redirect('/products');
    } catch (error) {
        console.error('Add product error:', error);
        res.status(400).send('Failed to add product');
    }
});

//delete product
router.get('/delete-product/:id', async (req, res) => {
    
    try {
        const product = await axios.get(`${BASE_URL_PRODUCT}/${req.params.id}`)
        res.render('delete-product', {product: product.data})
    } catch (error) {
        console.log(error)
        res.status(400).send('Failed to delete product')
    }
    
});

router.post('/delete-product/:id', async (req, res) => {
    console.log("dans le delete")
    try {
        const product = await axios.delete(`${BASE_URL_PRODUCT}/${req.params.id}`,{
            headers: { Authorization: `Bearer ${req.session.token}`}});
        res.redirect("/products"); // Redirigez vers la page des produits après la suppression
    } catch (error) {
        console.log(error);
        res.status(400).send('Failed to delete product');
    }
})

module.exports = router;
