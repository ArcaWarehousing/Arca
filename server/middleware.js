const jwt = require("jsonwebtoken");
const yup = require("yup");
const mysql = require('mysql');
const cors = require('cors');
const util = require("util");
const multer = require("multer");
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require("uuid");
const path = require('path');

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

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your frontend's origin
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

const corsMiddleware = cors(corsOptions);

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
class fileUploader {
  static imagesOnly = ["image/png", "image/jpg", "image/jpeg", "image/pdf", "image/doc", "image/docx"];

  constructor(dbConfig, fileTypes = undefined) {
    this.dbConfig = dbConfig;

    // Configure multer storage
    this.storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'uploads/');
      },
      filename: (req, file, cb) => {
        const filename = `${uuidv4()}-file-${file.originalname}`;
        cb(null, filename);
      }
    });

    this.uploadFiles = multer({ storage: this.storage }).single("file");
    this.uploadFilesMiddleware = util.promisify(this.uploadFiles);

    this.upload = async (req, res, next) => {
      try {
        await this.uploadFilesMiddleware(req, res);
        if (req.file == undefined) {
          return res.send({
            message: "You must select a file.",
          });
        }
        req.body.filePath = path.join('uploads', req.file.filename); // Add file path to request body
        next();
      } catch (error) {
        return res.status(500).send({ message: error.message });
      }
    };

    // Max of 10 uploaded files also for images
    this.uploadMultipleFiles = multer({ storage: this.storage }).array("file", 10);
    this.uploadMultipleFilesMiddleware = util.promisify(this.uploadMultipleFiles);
    this.uploadMultiple = async (req, res, next) => {
      try {
        await this.uploadMultipleFilesMiddleware(req, res);
        if (req.files.length <= 0) {
          return res.status(400).send({ message: "You must upload at least 1 file." });
        }
        next();
      } catch (error) {
        return res.status(500).send({ message: error.message });
      }
    };

    this.getList = async (req, res) => {
      try {
        const sql = `SELECT * FROM ${this.dbConfig.fileBucket}`;
        db.query(sql, (err, results) => {
          if (err || results.length === 0) {
            return res.status(500).send({ message: "No files found!" });
          }
          let fileInfos = results.map(doc => ({
            name: doc.filename,
            url: process.env.API_ROUTE + this.dbConfig.baseUrl + doc.filename,
          }));
          return res.status(200).send(fileInfos);
        });
      } catch (error) {
        return res.status(500).send({ message: error.message });
      }
    };

    this.download = async (req, res) => {
      try {
        const fileName = req.params.name;
        const filePath = `uploads/${fileName}`;
        res.download(filePath, (err) => {
          if (err) {
            return res.status(404).send({ message: err.message });
          }
        });
      } catch (error) {
        return res.status(500).send({ message: error.message });
      }
    };
  }
}

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

module.exports = { validate, corsMiddleware, fileUploader, sendEmail };