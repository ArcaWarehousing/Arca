const express = require('express');
const router = express.Router();
const { jwtAuth, fileUploader } = require('../middleware.js');
const goodsCtrler = require('../controller/goodsController.js');

const goodsImgDb = {
    fileBucket: "goodsImages",
    baseUrl: "files/"
};
goodsfileUploader = new fileUploader(goodsImgDb, fileUploader.imagesOnly);

router.post('/uploadGoods', jwtAuth, goodsCtrler.uploadGoods);
router.get('/getUserGoods', jwtAuth, goodsCtrler.getUserGoods);
// router.get('/getSpecificGood', jwtAuth);
router.put('/updateGoods/', jwtAuth, goodsCtrler.updateUserGoods);
router.put('/uploadImages/:goodId', jwtAuth, goodsfileUploader.uploadMultiple, goodsCtrler.uploadPictures)

router.get('/downloadImages/:name', goodsfileUploader.download);

// router.post('/searchGoods');


module.exports = router;
