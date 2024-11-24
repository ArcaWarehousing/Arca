const express = require('express');
const router = express.Router();
const { jwtAuth, fileUploader } = require('../middleware.js');
const warehousesCtrler = require('../controller/warehouseController.js');

const warehousesImgDb = {
    fileBucket: "warehousesImages",
    baseUrl: "files/"
};
warehouseImageFileUploader = new fileUploader(warehousesImgDb, fileUploader.imagesOnly);

const warehousesVerificationPaperworkDb = {
    fileBucket: "warehouseVerificationPapers",
    baseUrl: "files/"
};
warehouseFileUploader = new fileUploader(warehousesVerificationPaperworkDb);

router.post('/uploadWarehouse', jwtAuth, warehousesCtrler.uploadWarehouse);
router.get('/getUserWarehouses', jwtAuth, warehousesCtrler.getUserWarehouses);
router.put('/updateWarehouse/', jwtAuth, warehousesCtrler.updateUserWarehouses);

router.put('/uploadPaperwork/:warehouseId', jwtAuth, warehouseFileUploader.upload, warehousesCtrler.uploadPaperwork)
router.get('/downloadPaperwork/:name', warehouseFileUploader.download);


router.put('/uploadImages/:warehouseId', jwtAuth, warehouseImageFileUploader.uploadMultiple, warehousesCtrler.uploadPictures)
router.get('/downloadImages/:name', warehouseImageFileUploader.download);

router.get('/requestVerification/:warehouseId', warehousesCtrler.requestVerification);
router.post('/search', warehousesCtrler.search);


module.exports = router;