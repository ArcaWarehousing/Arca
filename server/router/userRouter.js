const express = require('express');
const router = express.Router();
const { jwtAuth, fileUploader } = require('../middleware.js');
const fileUploader = require('../utils/fileUploader.js');
const userController = require('../controller/userController.js');
// authentication routes
router.post('/create', userController.signup);
router.post('/login', userController.signin);
router.delete('/logout', userController.logoutUser);
// profile management
router.get('/getProfile', jwtAuth, userController.getProfile);
router.put('/updateProfile', jwtAuth, userController.updateProfile);
router.get('/forgotPassword/:email', userController.forgotPassword);

// file upload for user verification
const userVerificationDb = {
    fileBucket: "userVerificationPapers",
    baseUrl: "files/"
};
insurancefileUploader = new fileUploader(userVerificationDb);

router.put('/secureUploadUserInsurance', jwtAuth, insurancefileUploader.upload, userController.secureUpload);
router.get('/requestVerification', jwtAuth, userController.requestVerification);

// Internal API's only (?)
router.get('/download/:name', insurancefileUploader.download);
router.delete('/deleteUser', userController.deleteUser);

module.exports = router;