const oracledb = require('oracledb');
// const dbConfig = require('../config/database'); //TODO: Setup config
const { v4: uuidv4 } = require('uuid');
// TODO: import oracle adb connection

// init users table
const USER_TABLE = `
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR2(36) PRIMARY KEY,
  uid VARCHAR2(255) NOT NULL,
  password VARCHAR2(255) NOT NULL,
  email VARCHAR2(255) NOT NULL UNIQUE,
  firstName VARCHAR2(255) DEFAULT '',
  lastName VARCHAR2(255) DEFAULT '',
  phoneNumber VARCHAR2(255) DEFAULT '',
  companyName VARCHAR2(255) DEFAULT '',
  ownedGoods CLOB DEFAULT '[]',
  insuranceFile CLOB DEFAULT '[]',
  ownedWarehouses CLOB DEFAULT '[]',
  transactions CLOB DEFAULT '[]',
  eligibleSeller NUMBER(1) DEFAULT 0,
  eligibleBuyer NUMBER(1) DEFAULT 0,
  verificationRequested NUMBER(1) DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

// User model class to handle database operations
class UserModel {
    constructor() {
        // this.tableName = 'users';
    }

    async initializeUserTable() {
        try {
            const connection = await oracledb.getConnection(); //TODO: Setup connection to DB
            await connection.execute(USER_TABLE); // create user table
            await connection.close();
        } catch (error) {
        console.error('Error initializing user table:', error);
        throw error;
        }
    }

    async createUser(userData) {
        try {
        const connection = await oracledb.getConnection();
        const id = uuidv4(); // generate or pass unique user id either from auth or generate here
        
        // Convert array/object fields to JSON strings
        const ownedGoods = JSON.stringify(userData.ownedGoods || []);
        const insuranceFile = JSON.stringify(userData.insuranceFile || []); //TODO: Handle file storage
        const ownedWarehouses = JSON.stringify(userData.ownedWarehouses || []);
        const transactions = JSON.stringify(userData.transactions || []);
        
        // Convert boolean values to numbers (0/1)
        const eligibleSeller = userData.eligibleSeller ? 1 : 0;
        const eligibleBuyer = userData.eligibleBuyer ? 1 : 0;
        const verificationRequested = userData.verificationRequested ? 1 : 0;

        const result = await connection.execute(
            `INSERT INTO ${this.tableName} (
            id, uid, password, email, firstName, lastName, phoneNumber, companyName,
            ownedGoods, insuranceFile, ownedWarehouses, transactions,
            eligibleSeller, eligibleBuyer, verificationRequested
            ) VALUES (
            :id, :uid, :password, :email, :firstName, :lastName, :phoneNumber, :companyName,
            :ownedGoods, :insuranceFile, :ownedWarehouses, :transactions,
            :eligibleSeller, :eligibleBuyer, :verificationRequested
            ) RETURNING id INTO :outputId`,
            {
            id, 
            uid: userData.uid,
            password: userData.password,
            email: userData.email,
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            phoneNumber: userData.phoneNumber || '',
            companyName: userData.companyName || '',
            ownedGoods,
            insuranceFile,
            ownedWarehouses,
            transactions,
            eligibleSeller,
            eligibleBuyer,
            verificationRequested,
            outputId: { type: oracledb.STRING, dir: oracledb.BIND_OUT }
            },
            { autoCommit: true }
        );

        await connection.close();
        return { _id: result.outBinds.outputId[0], ...userData };
        } catch (error) {
        console.error('Error creating user:', error);
        throw error;
        }
    }

    async findUser(query) {
        try {
        const connection = await oracledb.getConnection();
        
        // Build WHERE clause based on query
        const whereConditions = Object.entries(query)
            .map(([key, value]) => `${key} = :${key}`)
            .join(' AND ');
        
        const result = await connection.execute(
            `SELECT * FROM ${this.tableName} WHERE ${whereConditions}`,
            query,
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        
        await connection.close();
        
        if (result.rows.length === 0) return null;
        
        // Convert the row to a user object
        const user = this._convertRowToUser(result.rows[0]);
        return user;
        } catch (error) {
        console.error('Error finding user:', error);
        throw error;
        }
    }

    async findUserById(id) {
        return this.findUser({ id });
    }

    async checkUserExists(query) {
        try {
        const connection = await oracledb.getConnection();
        
        // Build WHERE clause based on query
        const whereConditions = Object.entries(query)
            .map(([key, value]) => `${key} = :${key}`)
            .join(' AND ');
        
        const result = await connection.execute(
            `SELECT COUNT(*) as count FROM ${this.tableName} WHERE ${whereConditions}`,
            query
        );
        
        await connection.close();
        return result.rows[0][0] > 0;
        } catch (error) {
        console.error('Error checking if user exists:', error);
        throw error;
        }
    }

  // Helper method to convert Oracle db row to user object
    _convertRowToUser(row) {
        return {
        _id: row.ID,
        uid: row.UID,
        password: row.PASSWORD,
        email: row.EMAIL,
        firstName: row.FIRSTNAME,
        lastName: row.LASTNAME,
        phoneNumber: row.PHONENUMBER,
        companyName: row.COMPANYNAME,
        ownedGoods: JSON.parse(row.OWNEDGOODS || '[]'),
        insuranceFile: JSON.parse(row.INSURANCEFILE || '[]'),
        ownedWarehouses: JSON.parse(row.OWNEDWAREHOUSES || '[]'),
        transactions: JSON.parse(row.TRANSACTIONS || '[]'),
        eligibleSeller: row.ELIGIBLESELLER === 1,
        eligibleBuyer: row.ELIGIBLEBUYER === 1,
        verificationRequested: row.VERIFICATIONREQUESTED === 1,
        createdAt: row.CREATEDAT,
        updatedAt: row.UPDATEDAT,
        save: async function() {
            return userModel.updateUser(this._id, this);
        }
        };
    }

    async updateUser(id, userData) {
        try {
        const connection = await oracledb.getConnection();
        
        // Convert array/object fields to JSON strings
        if (userData.ownedGoods) userData.ownedGoods = JSON.stringify(userData.ownedGoods);
        if (userData.insuranceFile) userData.insuranceFile = JSON.stringify(userData.insuranceFile);
        if (userData.ownedWarehouses) userData.ownedWarehouses = JSON.stringify(userData.ownedWarehouses);
        if (userData.transactions) userData.transactions = JSON.stringify(userData.transactions);
        
        // Convert boolean values to numbers (0/1)
        if (userData.eligibleSeller !== undefined) userData.eligibleSeller = userData.eligibleSeller ? 1 : 0;
        if (userData.eligibleBuyer !== undefined) userData.eligibleBuyer = userData.eligibleBuyer ? 1 : 0;
        if (userData.verificationRequested !== undefined) userData.verificationRequested = userData.verificationRequested ? 1 : 0;
        
        // Build SET clause
        const setClause = Object.entries(userData)
            .filter(([key]) => key !== '_id' && key !== 'id' && key !== 'save')
            .map(([key]) => `${key} = :${key}`)
            .join(', ');
        
        await connection.execute(
            `UPDATE ${this.tableName} SET ${setClause}, updatedAt = CURRENT_TIMESTAMP WHERE id = :id`,
            { ...userData, id },
            { autoCommit: true }
        );
        
        await connection.close();
        return this.findUserById(id);
        } catch (error) {
        console.error('Error updating user:', error);
        throw error;
        }
        }
}

const userModel = new UserModel();
module.exports = {
    userModel,
};