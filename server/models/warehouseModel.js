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
exports.createWarehouse = (warehouseData, callback) => {
  const sql = `INSERT INTO warehouses (associated_user, name, street, city, state, zip, description, total_sqft, external_used_sqft, available_sqft, price_per_sqft_per_month, downpayment_percentage, warehouse_type, refrigerated, ceiling_height, loading_docks, security_cameras, security_guards, special_features) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(sql, [
    warehouseData.associatedUser,
    warehouseData.name,
    warehouseData.address.street,
    warehouseData.address.city,
    warehouseData.address.state,
    warehouseData.address.zip,
    warehouseData.description,
    warehouseData.totalSqft,
    warehouseData.externalUsedSqft,
    warehouseData.availableSqft,
    warehouseData.pricePerSqftPerMonth,
    warehouseData.downpaymentPercentage,
    warehouseData.warehouseType,
    warehouseData.refrigerated,
    warehouseData.ceilingHeight,
    warehouseData.loadingDocks,
    warehouseData.securityCameras,
    warehouseData.securityGuards,
    warehouseData.specialFeatures
  ], callback);
};

// Function to find warehouses by user ID
exports.findWarehousesByUserId = (userId, callback) => {
  const sql = `SELECT * FROM warehouses WHERE associated_user = ?`;
  db.query(sql, [userId], callback);
};

// Function to update a warehouse
exports.updateWarehouse = (warehouseId, warehouseData, callback) => {
  const sql = `UPDATE warehouses SET name = ?, street = ?, city = ?, state = ?, zip = ?, description = ?, total_sqft = ?, external_used_sqft = ?, available_sqft = ?, price_per_sqft_per_month = ?, downpayment_percentage = ?, warehouse_type = ?, refrigerated = ?, ceiling_height = ?, loading_docks = ?, security_cameras = ?, security_guards = ?, special_features = ? WHERE id = ? AND associated_user = ?`;
  db.query(sql, [
    warehouseData.name,
    warehouseData.address.street,
    warehouseData.address.city,
    warehouseData.address.state,
    warehouseData.address.zip,
    warehouseData.description,
    warehouseData.totalSqft,
    warehouseData.externalUsedSqft,
    warehouseData.availableSqft,
    warehouseData.pricePerSqftPerMonth,
    warehouseData.downpaymentPercentage,
    warehouseData.warehouseType,
    warehouseData.refrigerated,
    warehouseData.ceilingHeight,
    warehouseData.loadingDocks,
    warehouseData.securityCameras,
    warehouseData.securityGuards,
    warehouseData.specialFeatures,
    warehouseId,
    warehouseData.associatedUser
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
  const sql = `SELECT * FROM warehouses WHERE name LIKE ? OR city LIKE ? OR state LIKE ? OR zip LIKE ?`;
  db.query(sql, [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`], callback);
};