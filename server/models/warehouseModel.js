const mysql = require('mysql');

// Establish connection to MySQL database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Arca',
  database: 'arcasql'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Function to create a new warehouse
exports.uploadWarehouse = (warehouseData, callback) => {
  const sql = `INSERT INTO warehouses (uid, name, location, photos, legalDocuments, refrigerated, size, used, type, costPerMonth, downPaymentPercent, height, docks, cameras, guards, goodsStored) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(sql, [
    warehouseData.uid,
    warehouseData.name,
    warehouseData.location,
    warehouseData.photos,
    warehouseData.legalDocuments,
    warehouseData.refrigerated,
    warehouseData.size,
    warehouseData.used,
    warehouseData.type,
    warehouseData.costPerMonth,
    warehouseData.downPaymentPercent,
    warehouseData.height,
    warehouseData.docks,
    warehouseData.cameras,
    warehouseData.guards,
    warehouseData.goodsStored
  ], callback);
};

// Function to find warehouses by user ID
exports.findWarehousesByUserId = (userId, callback) => {
  const sql = `SELECT * FROM StorageUnits WHERE uid = ?`;
  db.query(sql, [userId], callback);
};

// Function to update a warehouse
exports.updateWarehouse = (warehouseId, warehouseData, callback) => {
  const sql = `UPDATE StorageUnits SET name = ?, location = ?, photos = ?, legalDocuments = ?, refrigerated = ?, size = ?, used = ?, type = ?, costPerMonth = ?, downPaymentPercent = ?, height = ?, docks = ?, cameras = ?, guards = ?, goodsStored = ? WHERE uid = ?`;
  db.query(sql, [
    warehouseData.name,
    warehouseData.location,
    warehouseData.photos,
    warehouseData.legalDocuments,
    warehouseData.refrigerated,
    warehouseData.size,
    warehouseData.used,
    warehouseData.type,
    warehouseData.costPerMonth,
    warehouseData.downPaymentPercent,
    warehouseData.height,
    warehouseData.docks,
    warehouseData.cameras,
    warehouseData.guards,
    warehouseData.goodsStored,
    warehouseId
  ], callback);
};

// Function to upload pictures for a warehouse
exports.uploadPictures = (warehouseId, pictureUrls, callback) => {
  const sql = `INSERT INTO warehouse_pictures (warehouse_id, url) VALUES ?`;
  const values = pictureUrls.map(url => [warehouseId, url]);
  db.query(sql, [values], callback);
};

// Function to upload verification paperwork for a warehouse
exports.uploadPaperwork = (warehouseId, paperworkUrl, callback) => {
  const sql = `INSERT INTO warehouse_verification_paperwork (warehouse_id, url) VALUES (?, ?)`;
  db.query(sql, [warehouseId, paperworkUrl], callback);
};

// Function to search for warehouses based on criteria
exports.searchWarehouses = (query, callback) => {
  const sql = `SELECT * FROM StorageUnits WHERE name LIKE ? OR location LIKE ? OR type LIKE ?`;
  db.query(sql, [`%${query}%`, `%${query}%`, `%${query}%`], callback);
};