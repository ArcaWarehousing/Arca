const jwt = require('jsonwebtoken');

/**
 * Generates a JWT token for a user
 * @param {Object} payload - The data to include in the token
 * @param {boolean} rememberMe - Whether to extend token expiration
 * @returns {string} The generated JWT token
 */
exports.generateToken = (payload, rememberMe = false) => {
    return jwt.sign(
    payload,
    process.env.NEXTAUTH_SECRET,
    { expiresIn: rememberMe ? '30d' : '1d' }
    );
};

/**
 * Verifies a JWT token
 * @param {string} token - The token to verify
 * @returns {Object|null} The decoded token payload or null if invalid
 */
exports.verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.NEXTAUTH_SECRET);
    } catch (error) {
        console.error('Token verification failed:', error.message);
        return null;
    }
};