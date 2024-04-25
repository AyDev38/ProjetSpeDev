const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./models/database');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(session({
    store: new SQLiteStore({ db: '../db/database.sqlite' }),
    secret: 'your secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true}  // `true` if you are using HTTPS
  }));
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes); // Make sure user routes are also used

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
  });
});
