const jwt = require("jsonwebtoken");
const { schema } = require("./models/warehouseModel");
const yup = require("yup");

const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;
const util = require("util");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const nodemailer = require('nodemailer');
const { userModel } = require("./models/userModel");
const { v4: uuidv4 } = require("uuid");

// Function to add if you want a protected route
const jwtAuth = (req, res, next) => {
  const token = req.cookies.authToken;
  try {
    const user = jwt.verify(token, process.env.SERVER_SECRET_JWT);
    req.user = user;
    if (req.user.exp * 10e3 - new Date().getTime() < 0) throw new Error("Token Expired");
    if (userModel.findById(req.user.exp) == undefined) throw new Error("User doesn't exist");
    next();
  }
  catch (error) {
    res.clearCookie("authToken");
    console.log("redirecting")
    res.status(401).send({ message: "Unauthorized: " + token + " or error: " + error.message });
  }
};

// Function to validate a scheema
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


class fileUploader {
  static imagesOnly = ["image/png", "image/jpg", "image/jpeg"];

  constructor(dbConfig, fileTypes = undefined) {
    this.dbConfig = dbConfig
    this.mongoClient = new MongoClient(process.env.MONGODB_URL);

    this.storage = new GridFsStorage({
      url: process.env.MONGODB_URL,
      options: { useNewUrlParser: true, useUnifiedTopology: true },
      file: (req, file) => {
        if (fileTypes != undefined) {
          if (fileTypes.indexOf(file.mimetype) == -1) {
            const filename = `${uuidv4()}-file-${file.originalname}`;
            return filename;
          }
        }

        return {
          bucketName: dbConfig.fileBucket,
          filename: `${uuidv4()}-file-${file.originalname}`
        };
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

        next();
      } catch (error) {
        return res.status(500).send({ message: error.message, });
      }
    }

    // Max of 10 uplaoded Files also for images
    this.uploadMultipleFiles = multer({ storage: this.storage }).array("file", 10);
    this.uploadMultipleFilesMiddleware = util.promisify(this.uploadMultipleFiles);
    this.uploadMultiple = async (req, res, next) => {
      try {
        await this.uploadMultipleFilesMiddleware(req, res);
        if (req.files.length <= 0) {
          return res
            .status(400)
            .send({ message: "You must upload at least 1 file." });
        }

        next();
      } catch (error) {
        return res.status(500).send({ message: error.message, });
      }
    }

    this.getList = async (req, res) => {
      try {
        await this.mongoClient.connect();

        const database = this.mongoClient.db(this.dbConfig.database);
        const files = database.collection(this.dbConfig.fileBucket + ".files");

        const cursor = files.find({});

        if ((await cursor.count()) === 0) {
          return res.status(500).send({
            message: "No files found!",
          });
        }

        let fileInfos = [];
        await cursor.forEach((doc) => {
          fileInfos.push({
            name: doc.filename,
            url: process.env.API_ROUTE + this.dbConfig.baseUrl + doc.filename,
          });
        });

        return res.status(200).send(fileInfos);
      } catch (error) {
        return res.status(500).send({ message: error.message });
      }
    }

    this.download = async (req, res) => {
      try {
        await this.mongoClient.connect();

        const database = this.mongoClient.db(this.dbConfig.database);
        const bucket = new GridFSBucket(database, {
          bucketName: this.dbConfig.fileBucket,
        });
        const fileName = req.params.name;
        let downloadStream = bucket.openDownloadStreamByName(fileName);

        downloadStream.on("data", function (data) {
          return res.status(200).write(data);
        });

        downloadStream.on("error", function (err) {
          return res.status(404).send({ message: err.message });
        });

        downloadStream.on("end", () => {
          return res.end();
        });
      } catch (error) {
        return res.status(500).send({
          message: error.message,
        });
      }
    }


  }
}


const transporter = nodemailer.createTransport({
  port: 465,               // true for 465, false for other ports
  host: "smtp.gmail.com",
  auth: {
    user: process.env.SENDING_EMAIL,
    pass: process.env.SENDING_EMAIL_PASSWORD,
  },
  secure: true,
});


//test this!
const sendEmail = (req) => {
  const mailData = {
    from: process.env.SENDING_EMAIL,  // sender address
    to: req.person,   // list of receivers
    subject: req.subject,
    text: 'text',
    html: req.message,
  };
  try {
    transporter.sendMail(mailData, function (err, info) {
      if (err) console.log(err)
      else return info.response;
    })
  } catch (error) {
    console.log(error)
  }
};


module.exports = { jwtAuth, validate, fileUploader, sendEmail };