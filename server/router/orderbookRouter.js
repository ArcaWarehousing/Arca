const express = require('express');
const router = express.Router();
const { jwtAuth, fileUploader } = require('../middleware.js');
const orderbookModel = require('../controller/orderbookModelController.js');


router.post('/uploadWarehouse', jwtAuth);

module.exports = router;