const jwt = require("jsonwebtoken");
const yup = require("yup");
const mysql = require('mysql');
const util = require("util");
const multer = require("multer");
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require("uuid");
const { verifyToken } = require('./utils/jwtUtil');

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

const jwtAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication token required' });
  }
  
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
  
  req.user = decoded;
  next();
};
/*
const jwtAuth = (req, res, next) => {
  const token = req.cookies.authToken;
  try {
    const user = jwt.verify(token, process.env.SERVER_SECRET_JWT);
    req.user = user;
    if (req.user.exp * 10e3 - new Date().getTime() < 0) throw new Error("Token Expired");

    // Check if user exists in MySQL database
    const sql = `SELECT * FROM users WHERE id = ?`;
    db.query(sql, [req.user.id], (err, results) => {
      if (err || results.length === 0) {
        res.clearCookie("authToken");
        return res.status(401).send({ message: "Unauthorized: " + token + " or error: " + err.message });
      }
      next();
    });
  } catch (error) {
    res.clearCookie("authToken");
    console.log("redirecting");
    res.status(401).send({ message: "Unauthorized: " + token + " or error: " + error.message });
  }
};
*/
// Function to validate a schema
const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (err) {
    return res.status(500).json({ type: err.name, message: err.message });
  }
};

// File uploader class for handling file uploads
// class fileUploader {
//   static imagesOnly = ["image/png", "image/jpg", "image/jpeg"];

//   constructor(dbConfig, fileTypes = undefined) {
//     this.dbConfig = dbConfig;

//     // Configure multer storage
//     this.storage = multer.diskStorage({
//       destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//       },
//       filename: (req, file, cb) => {
//         const filename = `${uuidv4()}-file-${file.originalname}`;
//         cb(null, filename);
//       }
//     });

//     this.uploadFiles = multer({ storage: this.storage }).single("file");
//     this.uploadFilesMiddleware = util.promisify(this.uploadFiles);

//     this.upload = async (req, res, next) => {
//       try {
//         await this.uploadFilesMiddleware(req, res);
//         if (req.file == undefined) {
//           return res.send({
//             message: "You must select a file.",
//           });
//         }
//         next();
//       } catch (error) {
//         return res.status(500).send({ message: error.message });
//       }
//     };

//     // Max of 10 uploaded files also for images
//     this.uploadMultipleFiles = multer({ storage: this.storage }).array("file", 10);
//     this.uploadMultipleFilesMiddleware = util.promisify(this.uploadMultipleFiles);
//     this.uploadMultiple = async (req, res, next) => {
//       try {
//         await this.uploadMultipleFilesMiddleware(req, res);
//         if (req.files.length <= 0) {
//           return res.status(400).send({ message: "You must upload at least 1 file." });
//         }
//         next();
//       } catch (error) {
//         return res.status(500).send({ message: error.message });
//       }
//     };

//     this.getList = async (req, res) => {
//       try {
//         const sql = `SELECT * FROM ${this.dbConfig.fileBucket}`;
//         db.query(sql, (err, results) => {
//           if (err || results.length === 0) {
//             return res.status(500).send({ message: "No files found!" });
//           }
//           let fileInfos = results.map(doc => ({
//             name: doc.filename,
//             url: process.env.API_ROUTE + this.dbConfig.baseUrl + doc.filename,
//           }));
//           return res.status(200).send(fileInfos);
//         });
//       } catch (error) {
//         return res.status(500).send({ message: error.message });
//       }
//     };

//     this.download = async (req, res) => {
//       try {
//         const fileName = req.params.name;
//         const filePath = `uploads/${fileName}`;
//         res.download(filePath, (err) => {
//           if (err) {
//             return res.status(404).send({ message: err.message });
//           }
//         });
//       } catch (error) {
//         return res.status(500).send({ message: error.message });
//       }
//     };
//   }
// }

// Configure nodemailer for sending emails
const transporter = nodemailer.createTransport({
  port: 465, // true for 465, false for other ports
  host: "smtp.gmail.com",
  auth: {
    user: process.env.SENDING_EMAIL,
    pass: process.env.SENDING_EMAIL_PASSWORD,
  },
  secure: true,
});

// Function to send emails
const sendEmail = (req) => {
  const mailData = {
    from: process.env.SENDING_EMAIL, // sender address
    to: req.person, // list of receivers
    subject: req.subject,
    text: 'text',
    html: req.message,
  };
  try {
    transporter.sendMail(mailData, function (err, info) {
      if (err) console.log(err);
      else return info.response;
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { validate, fileUploader, sendEmail };