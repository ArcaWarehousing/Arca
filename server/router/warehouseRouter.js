const express = require('express');
const router = express.Router();
const { jwtAuth, fileUploader } = require('../middleware');
const warehousesCtrler = require('../controller/warehouseController');

// Configuration for image file uploads
const warehousesImgDb = {
  fileBucket: "warehousesImages",
  baseUrl: "files/"
};
const warehouseImageFileUploader = new fileUploader(warehousesImgDb, fileUploader.imagesOnly);

// Configuration for verification paperwork uploads
const warehousesVerificationPaperworkDb = {
  fileBucket: "warehouseVerificationPapers",
  baseUrl: "files/"
};
const warehouseFileUploader = new fileUploader(warehousesVerificationPaperworkDb);

// Define routes for warehouse operations
router.post('/uploadWarehouse', warehousesCtrler.uploadWarehouse);
router.get('/getUserWarehouses', warehousesCtrler.getUserWarehouses);
router.put('/updateWarehouse/:warehouseId', warehousesCtrler.updateUserWarehouses);

router.put('/uploadPaperwork/:warehouseId', warehouseFileUploader.upload, warehousesCtrler.uploadPaperwork);
router.get('/downloadPaperwork/:name', warehouseFileUploader.download);

router.put('/uploadImages/:warehouseId', warehouseImageFileUploader.uploadMultiple, warehousesCtrler.uploadPictures);
router.get('/downloadImages/:name', warehouseImageFileUploader.download);

router.post('/search', warehousesCtrler.searchWarehouses);

module.exports = router;