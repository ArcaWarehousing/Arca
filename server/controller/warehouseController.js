const mysql = require('mysql');
const yup = require('yup');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { sendEmail } = require('../middleware');

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
  name: yup.string().required(),
  address: yup.object({
    street: yup.string().required(),
    city: yup.string().required(),
    state: yup.string().required(),
    zip: yup.number().required(),
  }),
  description: yup.string().default(''),
  totalSqft: yup.number().required().min(0),
  externalUsedSqft: yup.number().required().min(0),
  availableSqft: yup.number().required().min(0),
  pricePerSqftPerMonth: yup.number().required().min(0),
  downpaymentPercentage: yup.number().required().min(0).max(100),
  warehouseType: yup.string().required().oneOf(['Public', 'Private', 'Shared', 'Specialized']),
  refrigerated: yup.boolean().required(),
  ceilingHeight: yup.number().required().min(0),
  loadingDocks: yup.number().required().min(0),
  securityCameras: yup.boolean().required(),
  securityGuards: yup.boolean().required(),
  specialFeatures: yup.string().default(''),
});

// Function to upload a new warehouse
exports.uploadWarehouse = async (req, res) => {
  try {
    const uid = req.body.uid; // Assuming uid is provided in the request body
    let validatedData = await warehouseSchema.validate(req.body);

    // Parameterized query to prevent SQL injection
    const sql = `INSERT INTO warehouses (associated_user, name, street, city, state, zip, description, total_sqft, external_used_sqft, available_sqft, price_per_sqft_per_month, downpayment_percentage, warehouse_type, refrigerated, ceiling_height, loading_docks, security_cameras, security_guards, special_features) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [uid, validatedData.name, validatedData.address.street, validatedData.address.city, validatedData.address.state, validatedData.address.zip, validatedData.description, validatedData.totalSqft, validatedData.externalUsedSqft, validatedData.availableSqft, validatedData.pricePerSqftPerMonth, validatedData.downpaymentPercentage, validatedData.warehouseType, validatedData.refrigerated, validatedData.ceilingHeight, validatedData.loadingDocks, validatedData.securityCameras, validatedData.securityGuards, validatedData.specialFeatures], (err, result) => {
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
    name: warehouse.name,
    warehouseId: warehouse.id,
    associatedUser: warehouse.associated_user,
    address: {
      street: warehouse.street,
      city: warehouse.city,
      state: warehouse.state,
      zip: warehouse.zip,
    },
    photos: warehouse.photos,
    description: warehouse.description,
    totalSqft: warehouse.total_sqft,
    externalUsedSqft: warehouse.external_used_sqft,
    availableSqft: warehouse.available_sqft,
    pricePerSqftPerMonth: warehouse.price_per_sqft_per_month,
    downpaymentPercentage: warehouse.downpayment_percentage,
    warehouseType: warehouse.warehouse_type,
    refrigerated: warehouse.refrigerated,
    ceilingHeight: warehouse.ceiling_height,
    loadingDocks: warehouse.loading_docks,
    securityCameras: warehouse.security_cameras,
    securityGuards: warehouse.security_guards,
    specialFeatures: warehouse.special_features,
    verified: warehouse.verified,
    publiclySearchable: warehouse.publicly_searchable,
  };
};

// Function to get warehouses associated with a user
exports.getUserWarehouses = async (req, res) => {
  try {
    const uid = req.body.uid; // Assuming uid is provided in the request body
    // Parameterized query to prevent SQL injection
    const sql = `SELECT * FROM warehouses WHERE associated_user = ?`;
    db.query(sql, [uid], (err, results) => {
      if (err) throw err;
      const returnWarehouses = results.filter(warehouse => warehouse.show_user).map(outputWarehouseCleaner);
      res.status(200).json(returnWarehouses);
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Function to update warehouse details
exports.updateUserWarehouses = async (req, res) => {
  try {
    const uid = req.body.uid; // Assuming uid is provided in the request body
    let validatedData = await warehouseSchema.validate(req.body);
    const { warehouseId } = await yup.object({ warehouseId: yup.string().required() }).validate(req.body);

    // Parameterized query to prevent SQL injection
    const sql = `UPDATE warehouses SET name = ?, street = ?, city = ?, state = ?, zip = ?, description = ?, total_sqft = ?, external_used_sqft = ?, available_sqft = ?, price_per_sqft_per_month = ?, downpayment_percentage = ?, warehouse_type = ?, refrigerated = ?, ceiling_height = ?, loading_docks = ?, security_cameras = ?, security_guards = ?, special_features = ? WHERE id = ? AND associated_user = ?`;
    db.query(sql, [validatedData.name, validatedData.address.street, validatedData.address.city, validatedData.address.state, validatedData.address.zip, validatedData.description, validatedData.totalSqft, validatedData.externalUsedSqft, validatedData.availableSqft, validatedData.pricePerSqftPerMonth, validatedData.downpaymentPercentage, validatedData.warehouseType, validatedData.refrigerated, validatedData.ceilingHeight, validatedData.loadingDocks, validatedData.securityCameras, validatedData.securityGuards, validatedData.specialFeatures, warehouseId, uid], (err, result) => {
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
    const user = await userModel.findById(uid);
    if (user.ownedWarehouses.indexOf(warehouseId) === -1) throw new Error("User doesn't own this item or item doesn't exist");

    const paperworkUrl = req.file.path;
    // Parameterized query to prevent SQL injection
    const sql = `INSERT INTO warehouse_verification_paperwork (warehouse_id, url) VALUES (?, ?)`;
    db.query(sql, [warehouseId, paperworkUrl], (err, result) => {
      if (err) throw err;
      res.status(200).send({ message: 'Documents uploaded successfully' });
    });
  } catch (error) {
    res.status(500).send({ message: 'Error uploading documents: ' + error.message });
  }
};

// Function to request verification for a warehouse
exports.requestVerification = async (req, res) => {
  try {
    const { warehouseId } = req.params;
    const uid = req.body.uid; // Assuming uid is provided in the request body
    const user = await userModel.findById(uid);
    const request = {
      person: process.env.BACKEND_NOTIFY_EMAIL.split(' '),
      subject: 'User Needs Verification for a Warehouse',
      message: `<b>This is an automated message</b><br> User: ${user.firstName} ${user.lastName} at ${user.email} requires verification for their warehouse with warehouse ID: ${warehouseId}<br/>`,
    };
    sendEmail(request);
    res.status(200).send({ message: 'Verification requested successfully' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Function to search for warehouses based on various criteria
exports.search = async (req, res) => {
  try {
    const { query } = req.body;
    // Parameterized query to prevent SQL injection
    const sql = `SELECT * FROM warehouses WHERE name LIKE ? OR city LIKE ? OR state LIKE ? OR zip LIKE ?`;
    db.query(sql, [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`], (err, results) => {
      if (err) throw err;
      const returnWarehouses = results.map(outputWarehouseCleaner);
      res.status(200).json(returnWarehouses);
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};