const jwt = require('jsonwebtoken');

// Middleware pour faire correspondre le token JWT envoyé par le client avec celui stocké dans la base de données
const authenticateToken = async (req, res, next) => {
    try {
        // console.log(req.headers);
        const token = req.headers.authorization.split(' ')[1];
        const payload = jwt.verify(token, 'your_secret_key');
        // console.log(payload);
        const user = await User.findByPk(payload.userId);
        if (user && user.token === token) {
            req.user = payload;
            next();
        } else {
            res.status(401).send({ message: "Unauthorized" });
        }
    } catch (error) {
        console.log(error);
        res.status(401).send({ message: "Unauthorized" });
    }
};

module.exports = authenticateToken;