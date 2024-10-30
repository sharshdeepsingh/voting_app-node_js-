const jwt = require('jsonwebtoken');
const Candidate = require('./Models/candidate'); // Adjust the path as necessary
const jwtAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.sendStatus(401); // Unauthorized if no token is provided
    }
    
    const token = authHeader.split(' ')[1]; // Ensure the token is extracted correctly

    if (!token) {
        return res.status(401).json({ error: 'invalid token' }); // Return error if token is not present
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({ error: 'token not found' }); // Fixed typo from 'sstatus' to 'status'
    }
}

const generateToken = (userData) => {
    return jwt.sign(userData, process.env.JWT_SECRET);
}

module.exports = { jwtAuthMiddleware, generateToken }