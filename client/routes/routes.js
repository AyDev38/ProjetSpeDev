const express = require('express');
const axios = require('axios');
const router = express.Router();

// URL de base pour le serveur back-end
const BASE_URL = 'http://localhost:5000/api/users';
const BASE_URL_PRODUCT = 'http://localhost:5000/api/products';
const BASE_URL_CART = 'http://localhost:5000/api/cart';

// Page d'accueil
router.get('/', (req, res) => {
    const isConnected = req.session.token ? true : false;
    res.render('index', { title: 'Home', isConnected: isConnected });
});

// Inscription
router.get('/register', (req, res) => {
    const isConnected = req.session.token ? true : false;
    res.render('register', { title: 'Register', isConnected: isConnected });
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
    const isConnected = req.session.token ? true : false;
    res.render('login', { title: 'Login' , isConnected: isConnected});
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
        const isConnected = req.session.token ? true : false;
        res.render('dashboard', { title: 'Dashboard', user: infosUser.data.user , isConnected: isConnected});
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
        const isConnected = req.session.token ? true : false;
        let response;
        if (search) {
            response = await axios.get(`${BASE_URL_PRODUCT}?search=${search}`);
        } else {
            response = await axios.get(`${BASE_URL_PRODUCT}`);
        }
        // console.log("response:", response.data)
        res.render('products', { title: 'Products', data: response.data, isConnected: isConnected});
    } catch (error) {
        console.error('Products error:', error);
        res.status(400).send('Failed to display products');
    }
});

// afficher un produit par son id
router.get('/products/:id', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL_PRODUCT}/${req.params.id}`);
        const isConnected = req.session.token ? true : false;
        // console.log(response.data);
        res.render('product', { title: 'Product', data: response.data, isConnected: isConnected });
    } catch (error) {
        console.error('Product error:', error);
        res.status(400).send('Failed to display product');
    }
});

//add prodcut 
router.get('/add-product', async (req, res) => {
    const isConnected = req.session.token ? true : false;
    res.render('add-product', {isConnected: isConnected});
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
        const isConnected = req.session.token ? true : false;
        res.render('delete-product', { product: product.data , isConnected: isConnected})
    } catch (error) {
        console.log(error)
        res.status(400).send('Failed to delete product')
    }

});

router.post('/delete-product/:id', async (req, res) => {
    try {
        const product = await axios.delete(`${BASE_URL_PRODUCT}/${req.params.id}`, {
            headers: { Authorization: `Bearer ${req.session.token}` }
        });
        res.redirect("/products");
    } catch (error) {
        console.log(error);
        res.status(400).send('Failed to delete product');
    }
})

//edit product
router.get('/edit-product/:id', async (req, res) => {
    try {
        const product = await axios.get(`${BASE_URL_PRODUCT}/${req.params.id}`)
        const isConnected = req.session.token ? true : false;
        res.render('edit-product', { data: product.data , isConnected: isConnected})
    } catch (error) {
        console.log(error)
        res.status(400).send("Failed to edit product")
    }

})

router.post('/edit-product/:id', async (req, res) => {
    try {
        const product = await axios.put(`${BASE_URL_PRODUCT}/${req.params.id}`, req.body, {
            headers: { Authorization: `Bearer ${req.session.token}` }
        });
        res.redirect("/products");
    } catch (error) {
        console.log(error)
        res.status(400).send("Failed to edit product")
    }

})

//show cart
router.get('/cart', async (req, res) => {
    try{
        const isConnected = req.session.token ? true : false;
        const user = await axios.get(`${BASE_URL}/infos`, {
            headers: { Authorization: `Bearer ${req.session.token}` }
        });
        const userId = user.data.user.id; // Récupérez l'ID de l'utilisateur
        const cart = await axios.get(`${BASE_URL_CART}`, {
            params: { userId: userId } // Passez l'ID de l'utilisateur comme paramètre
        });
        res.render('cart', { cart: cart.data, isConnected: isConnected });
    } catch (error) {
        console.log(error);
    }
});

// Route pour ajouter un produit au panier
router.get('/add-to-cart/:id/:quantity', async (req, res) => {
    try{
        const user = await axios.get(`${BASE_URL}/infos`, {
            headers: { Authorization: `Bearer ${req.session.token}` }
        });
        req.body.userId = user.data.user.id;
        req.body.productId = parseInt(req.params.id);
        req.body.quantity = parseInt(req.params.quantity);
        const cart = await axios.post(`${BASE_URL_CART}/add-to-cart`, req.body);
        const isConnected = req.session.token ? true : false
        res.redirect("/cart")
    } catch (error) {
        console.log(error)
    }
});

//add cart
router.post('/add-to-cart', async (req, res) => {
    try{
        res.redirect('/add-to-cart/' + req.body.productId + "/" + req.body.quantity)
    } catch (error) {
        console.log(error)
    }
})

// Route pour supprimer un produit du panier
router.get('/delete-cart/:id', async (req, res) => {
    try{
        const cart = await axios.delete(`${BASE_URL_CART}/${req.params.id}`)
        res.redirect("/cart");
    } catch (error) {
        console.log(error)
    }

})

// Route pour récupérer et renvoyer les produits triés par catégorie en JSON
router.get('/product-categories', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL_PRODUCT}`);
        const products = response.data;

        const categories = products.reduce((acc, product) => {
            const { categorie } = product;
            if (!acc[categorie]) {
                acc[categorie] = 0;
            }
            acc[categorie]++;
            return acc;
        }, {});

        const categoriesCount = Object.keys(categories).map(key => ({
            nom: key,
            compte: categories[key]
        }));

        // Convertit le tableau en JSON compact sans indentation
        const formattedJson = JSON.stringify(categoriesCount,null, 2);
        res.type('json').send(formattedJson);
    } catch (error) {
        console.error('Error retrieving products:', error);
        res.status(500).json({ error: 'Failed to retrieve products' });
    }
});

module.exports = router;