const express = require('express');
const router = express.Router();
const { jwtAuth, fileUploader } = require('../middleware.js');
const usrCtrler = require('../controller/userController.js');

router.post('/create', usrCtrler.signup);
router.post('/login', usrCtrler.signin);
router.delete('/logout', usrCtrler.logoutUser);

router.get('/getProfile', jwtAuth, usrCtrler.getProfile);
router.put('/updateProfile', jwtAuth, usrCtrler.updateProfile);
router.get('/forgotPassword/:email', usrCtrler.forgotPassword);


const userVerificationDb = {
    fileBucket: "userVerificationPapers",
    baseUrl: "files/"
};
insurancefileUploader = new fileUploader(userVerificationDb);


router.put('/secureUploadUserInsurance', jwtAuth, insurancefileUploader.upload, usrCtrler.secureUpload);
router.get('/requestVerification', jwtAuth, usrCtrler.requestVerification);

// Internal apis only
router.get('/download/:name', insurancefileUploader.download);
router.delete('/deleteUser', usrCtrler.deleteUser);

module.exports = router;
