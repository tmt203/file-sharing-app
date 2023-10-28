const express = require('express');
const viewController = require('../controllers/viewController');
const fileController = require('../controllers/fileController');

const router = express.Router();

router.get('/', viewController.getMainPage);
router.get('/files/:id', viewController.getDownloadPage);
router.get('/files/download/:id', fileController.downloadFile);

module.exports = router;