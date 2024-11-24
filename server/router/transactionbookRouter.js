const express = require('express');
const router = express.Router();
const { jwtAuth, fileUploader } = require('../middleware.js');
const tbookCtler = require('../controller/transactionbookController.js');
const dbConfig = {
    fileBucket: "fileSystem",
    baseUrl: "files/"
};

// Get Status
router.get('/transactionStatus/:id', jwtAuth, tbookCtler.transactionStatus);

// Initalize transactions
router.post('/createTransactionbookBuySide', jwtAuth, tbookCtler.createTransactionbookBuySide);

// Create bid offers between each other
router.post('/sellerSendNewTerms', jwtAuth, tbookCtler.sellerSendNewTerms);
router.post('/buyerSendNewTerms', jwtAuth, tbookCtler.buyerSendNewTerms);

router.post('/acceptTransaction', jwtAuth, tbookCtler.acceptTransaction);

router.post('/payTransaction', jwtAuth, tbookCtler.payTransaction);
router.post('/sendMessage', jwtAuth, tbookCtler.sendMessage);
// Change individal Transaction

module.exports = router;
