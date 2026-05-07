const jwt  = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // check if token is null
    if (!token) {
        return res.status(401).json({ message: 'Authentication token is required' });
    }

    // verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token expired or invalid, please login again' });
        }
        req.user = user;
        // req.user = decoded; // ✅ clean object
        
        next();
    });
};

module.exports = {authenticateToken};


