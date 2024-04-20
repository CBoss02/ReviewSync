const { admin } = require('../config/firebase-config');

const authMiddleware = async (req, res, next) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        return res.status(401).send('Unauthorized');
    }

    const token = req.headers.authorization.split('Bearer ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(403).send('Invalid token');
    }
};

module.exports = authMiddleware;