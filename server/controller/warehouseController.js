const mysql = require('mysql');
const yup = require('yup');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { sendEmail, fileUploader } = require('../middleware');

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

// Define the warehouse schema using yup for validation
const warehouseSchema = yup.object({
  uid: yup.number().required(),
  name: yup.string().required(),
  location: yup.string().required(),
  photos: yup.string().url(),
  legalDocuments: yup.string().url(),
  refrigerated: yup.boolean().required(),
  size: yup.string().required(),
  used: yup.number().required(),
  type: yup.string().required(),
  costPerMonth: yup.number().required().min(0),
  downPaymentPercent: yup.number().required().min(0).max(100),
  height: yup.number().required().min(0),
  docks: yup.number().required().min(0),
  cameras: yup.boolean().required(),
  guards: yup.boolean().required(),
  goodsStored: yup.string().required()
});

// Function to upload a new warehouse
exports.uploadWarehouse = async (req, res) => {
  try {
    let validatedData = await warehouseSchema.validate(req.body);

    // Parameterized query to prevent SQL injection
    const sql = `INSERT INTO warehouses (uid, name, location, photos, legalDocuments, refrigerated, size, used, type, costPerMonth, downPaymentPercent, height, docks, cameras, guards, goodsStored) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [
      validatedData.uid,
      validatedData.name,
      validatedData.location,
      validatedData.photos,
      validatedData.legalDocuments,
      validatedData.refrigerated,
      validatedData.size,
      validatedData.used,
      validatedData.type,
      validatedData.costPerMonth,
      validatedData.downPaymentPercent,
      validatedData.height,
      validatedData.docks,
      validatedData.cameras,
      validatedData.guards,
      validatedData.goodsStored
    ], (err, result) => {
      if (err) throw err;
      res.status(200).send({ message: 'Warehouse uploaded successfully' });
    });
  } catch (error) {
    res.status(500).send({ message: 'Error uploading warehouse ' + error.message });
  }
};

// Function to clean and format warehouse data for output
const outputWarehouseCleaner = (warehouse) => {
  return {
    uid: warehouse.uid,
    name: warehouse.name,
    location: warehouse.location,
    photos: warehouse.photos,
    legalDocuments: warehouse.legalDocuments,
    refrigerated: warehouse.refrigerated,
    size: warehouse.size,
    used: warehouse.used,
    type: warehouse.type,
    costPerMonth: warehouse.costPerMonth,
    downPaymentPercent: warehouse.downPaymentPercent,
    height: warehouse.height,
    docks: warehouse.docks,
    cameras: warehouse.cameras,
    guards: warehouse.guards,
    goodsStored: warehouse.goodsStored
  };
};

// Function to get warehouses associated with a user
exports.getUserWarehouses = async (req, res) => {
  try {
    const uid = req.body.uid; // Assuming uid is provided in the request body
    // Parameterized query to prevent SQL injection
    const sql = `SELECT * FROM StorageUnits WHERE uid = ?`;
    db.query(sql, [uid], (err, results) => {
      if (err) throw err;
      const returnWarehouses = results.map(outputWarehouseCleaner);
      res.status(200).json(returnWarehouses);
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Function to update warehouse details
exports.updateUserWarehouses = async (req, res) => {
  try {
    let validatedData = await warehouseSchema.validate(req.body);
    const { warehouseId } = await yup.object({ warehouseId: yup.string().required() }).validate(req.body);

    // Parameterized query to prevent SQL injection
    const sql = `UPDATE StorageUnits SET name = ?, location = ?, photos = ?, legalDocuments = ?, refrigerated = ?, size = ?, used = ?, type = ?, costPerMonth = ?, downPaymentPercent = ?, height = ?, docks = ?, cameras = ?, guards = ?, goodsStored = ? WHERE uid = ?`;
    db.query(sql, [
      validatedData.name,
      validatedData.location,
      validatedData.photos,
      validatedData.legalDocuments,
      validatedData.refrigerated,
      validatedData.size,
      validatedData.used,
      validatedData.type,
      validatedData.costPerMonth,
      validatedData.downPaymentPercent,
      validatedData.height,
      validatedData.docks,
      validatedData.cameras,
      validatedData.guards,
      validatedData.goodsStored,
      warehouseId
    ], (err, result) => {
      if (err) throw err;
      res.status(200).send({ message: 'Warehouse updated successfully' });
    });
  } catch (error) {
    res.status(500).send({ message: 'Error updating warehouse ' + error.message });
  }
};

// Function to upload pictures for a warehouse
exports.uploadPictures = async (req, res) => {
  try {
    const { warehouseId } = req.params;
    const uid = req.body.uid; // Assuming uid is provided in the request body
    const user = await userModel.findById(uid);
    if (user.ownedWarehouses.indexOf(warehouseId) === -1) throw new Error("User doesn't own this item or item doesn't exist");

    const pictureUrls = req.files.map(file => file.path);
    // Parameterized query to prevent SQL injection
    const sql = `INSERT INTO warehouse_pictures (warehouse_id, url) VALUES ?`;
    const values = pictureUrls.map(url => [warehouseId, url]);
    db.query(sql, [values], (err, result) => {
      if (err) throw err;
      res.status(200).send({ message: 'Pictures uploaded successfully' });
    });
  } catch (error) {
    res.status(500).send({ message: 'Error uploading pictures: ' + error.message });
  }
};

// Function to upload verification paperwork for a warehouse
exports.uploadPaperwork = async (req, res) => {
  try {
    const { warehouseId } = req.params;
    const uid = req.body.uid; // Assuming uid is provided in the request body
    const paperworkUrl = req.body.paperworkUrl;

    // Parameterized query to prevent SQL injection
    const sql = `INSERT INTO warehouse_verification_paperwork (warehouse_id, url) VALUES (?, ?)`;
    db.query(sql, [warehouseId, paperworkUrl], (err, result) => {
      if (err) throw err;
      res.status(200).send({ message: 'Paperwork uploaded successfully' });
    });
  } catch (error) {
    res.status(500).send({ message: 'Error uploading paperwork: ' + error.message });
  }
};

// Function to search for warehouses based on criteria
exports.searchWarehouses = (query, callback) => {
  const sql = `SELECT * FROM StorageUnits WHERE name LIKE ? OR location LIKE ? OR type LIKE ?`;
  db.query(sql, [`%${query}%`, `%${query}%`, `%${query}%`], callback);
};