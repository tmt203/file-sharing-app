const express = require('express');
const uploader = require('../utils/uploader');
const fileController = require('../controllers/fileController');

const router = express.Router();

router.post('/', uploader.single('file'), fileController.uploadFile);
router.post('/send', fileController.sendEmail);

module.exports = router;