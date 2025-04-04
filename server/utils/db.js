const oracledb = require('oracledb');
const fs = require('fs');
const path = require('path');

// get wallet location for db, TODO: needs to be stored securely on server in prod
const walletLocation = process.env.ORACLE_WALLET_LOCATION || path.join(__dirname, '../wallet');

let pool;

async function initializeDB() {
    try {
        // Set Oracle connection configuration
        oracledb.initOracleClient({ libDir: process.env.ORACLE_CLIENT_LIB_DIR });
        // Configure connection with wallet
        oracledb.connectionClass = 'NODEJS';

        // Create connection pool
        pool = await oracledb.createPool({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONNECTION_STRING,
            poolMin: 2, // min number of connections upon init
            poolMax: 10, // max number of open connections, can be adjusted higher or lower
            poolIncrement: 1, // number of new connections when all current connections are busy 
            poolTimeout: 60,
            homogeneous: true,
            // Wallet configuration
            configDir: walletLocation,
            walletLocation: walletLocation,
            walletPassword: process.env.ORACLE_WALLET_PASSWORD
        });
        console.log('Oracle connection pool initialized');
        return pool;
    } catch (err) {
        console.error('Error initializing Oracle connection pool:', err);
        throw err;
    }
}

/**
 * Gets a connection from the pool, if pool is empty initialize db connection pool
 * @returns {Promise<Connection>} Oracle connection object
 */
async function getConnection() {
    if (!pool) {
        await initializeDB();
    }
    return await pool.getConnection();
}

/**
 * Executes a SQL query and returns the result
 * @param {string} sql - SQL query to execute
 * @param {Object} binds - Bind variables for the query
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Query result
 */
async function execute(sql, binds = {}, options = {}) {
    let connection;
    try {
        connection = await getConnection();
        // Set default options
        const queryOptions = {
            outFormat: oracledb.OUT_FORMAT_OBJECT,
            autoCommit: true,
            ...options
        };
    const result = await connection.execute(sql, binds, queryOptions);
    return result;
    } catch (err) {
        console.error('Error executing query:', err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
}

/**
* Closes the connection pool
*/
async function closePool() {
    if (pool) {
        try {
        await pool.close(10);
            console.log('Oracle connection pool closed');
        } catch (err) {
            console.error('Error closing Oracle connection pool:', err);
        }
    }
}

module.exports = {
    getConnection,
    execute,
    closePool,
    initialize
};