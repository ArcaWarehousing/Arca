const { v4: uuidv4 } = require("uuid");
// TODO: Document and update fileuploader to work with ADB
class fileUploader {
  static imagesOnly = ["image/png", "image/jpg", "image/jpeg"];

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
        
        // Store file metadata in Oracle ADB
        if (req.file) {
          await this.saveFileMetadataToOracle(req.file);
        }
        
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
        
        // Store file metadata in Oracle ADB for each file
        if (req.files && req.files.length > 0) {
          for (const file of req.files) {
            await this.saveFileMetadataToOracle(file);
          }
        }
        
        next();
      } catch (error) {
        return res.status(500).send({ message: error.message });
      }
    };

    this.getList = async (req, res) => {
      try {
        // Get connection to Oracle ADB
        const connection = await this.getOracleConnection();
        
        try {
          // Query file metadata from Oracle ADB
          const result = await connection.execute(
            `SELECT * FROM ${this.dbConfig.fileBucket}`,
            [],
            { outFormat: connection.OUT_FORMAT_OBJECT }
          );
          
          if (!result.rows || result.rows.length === 0) {
            return res.status(404).send({ message: "No files found!" });
          }
          
          let fileInfos = result.rows.map(doc => ({
            name: doc.FILENAME,
            url: process.env.API_ROUTE + this.dbConfig.baseUrl + doc.FILENAME,
            uploadDate: doc.UPLOAD_DATE,
            size: doc.FILE_SIZE,
            mimetype: doc.MIMETYPE
          }));
          
          return res.status(200).send(fileInfos);
        } finally {
          // Close Oracle connection
          if (connection) {
            try {
              await connection.close();
            } catch (err) {
              console.error('Error closing connection', err);
            }
          }
        }
      } catch (error) {
        return res.status(500).send({ message: error.message });
      }
    };

    this.download = async (req, res) => {
      try {
        const fileName = req.params.name;
        const filePath = `uploads/${fileName}`;
        
        // Verify file exists in Oracle ADB before downloading
        const fileExists = await this.checkFileExistsInOracle(fileName);
        
        if (!fileExists) {
          return res.status(404).send({ message: "File not found in database" });
        }
        
        res.download(filePath, (err) => {
          if (err) {
            return res.status(404).send({ message: err.message });
          }
        });
      } catch (error) {
        return res.status(500).send({ message: error.message });
      }
    };
    
    // Helper methods for Oracle ADB integration
    
    this.getOracleConnection = async () => {
      // TODO: Implement actual Oracle ADB connection
      // Placeholder for now
      try {
        // const connection = await oracledb.getConnection(dbConfig);
        // return connection;
        console.log("Oracle connection placeholder - not implemented yet");
        return null;
      } catch (error) {
        console.error("Error connecting to Oracle ADB:", error);
        throw error;
      }
    };
    
    this.saveFileMetadataToOracle = async (file) => {
      // TODO: Implement actual Oracle ADB file metadata storage
      try {
        const connection = await this.getOracleConnection();
        if (!connection) return;
        
        try {
          // Example Oracle insert statement
          /*
          await connection.execute(
            `INSERT INTO ${this.dbConfig.fileBucket} (
              ID, FILENAME, ORIGINAL_NAME, MIMETYPE, FILE_SIZE, FILE_PATH, UPLOAD_DATE
            ) VALUES (
              :id, :filename, :originalName, :mimetype, :size, :path, CURRENT_TIMESTAMP
            )`,
            {
              id: uuidv4(),
              filename: file.filename,
              originalName: file.originalname,
              mimetype: file.mimetype,
              size: file.size,
              path: file.path
            }
          );
          await connection.commit();
          */
          console.log("Oracle file metadata storage placeholder - not implemented yet");
        } finally {
          // Close Oracle connection
          if (connection) {
            try {
              await connection.close();
            } catch (err) {
              console.error('Error closing connection', err);
            }
          }
        }
      } catch (error) {
        console.error("Error saving file metadata to Oracle:", error);
        throw error;
      }
    };
    
    this.checkFileExistsInOracle = async (fileName) => {
      // TODO: Implement actual Oracle ADB file check
      try {
        const connection = await this.getOracleConnection();
        if (!connection) return true; // Assume file exists if connection not implemented
        
        try {
          // Example Oracle query
          /*
          const result = await connection.execute(
            `SELECT COUNT(*) AS COUNT FROM ${this.dbConfig.fileBucket} WHERE FILENAME = :filename`,
            { filename: fileName },
            { outFormat: connection.OUT_FORMAT_OBJECT }
          );
          
          return result.rows[0].COUNT > 0;
          */
          console.log("Oracle file check placeholder - not implemented yet");
          return true; // Placeholder - assume file exists
        } finally {
          // Close Oracle connection
          if (connection) {
            try {
              await connection.close();
            } catch (err) {
              console.error('Error closing connection', err);
            }
          }
        }
      } catch (error) {
        console.error("Error checking file in Oracle:", error);
        return false;
      }
    };
  }
}