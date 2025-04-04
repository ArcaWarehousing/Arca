import bcrypt from 'bcrypt';

/**
 * Hashes a password using bcrypt with a salt factor of 10
 * @param {string} password - The plain text password to hash
 * @returns {Promise<string>} A promise that resolves to the hashed password
 */
export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10); //TODO: increase salt for prod
    return await bcrypt.hash(password, salt);
}

/**
 * Verifies if a plain text password matches a hashed password
 * @param {string} plainPassword - The plain text password to verify
 * @param {string} hashedPassword - The hashed password to compare against
 * @returns {Promise<boolean>} A promise that resolves to true if passwords match, false otherwise
 */
export async function verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}