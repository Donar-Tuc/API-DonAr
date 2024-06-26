const express = require('express');
const router = express.Router();
const { getFileFromGridFS } = require('../controllers/upload');
const { ensureDbConnection } = require("../middleware/ensureDbConnection");

router.get('/file/:id', ensureDbConnection, getFileFromGridFS);

module.exports = router;
