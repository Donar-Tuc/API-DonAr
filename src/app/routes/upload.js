const express = require('express');
const router = express.Router();
const { getFileFromGridFS } = require('../controllers/upload');

router.get('/upload/file/:id', getFileFromGridFS);

module.exports = router;
