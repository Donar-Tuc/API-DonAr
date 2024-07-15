/* const path = require("path")
const multer = require("multer")
const os = require("os");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, os.tmpdir());
    },
    filename: function (req, file, cb) {
        let ext = path.extname(file.originalname)
        cb(null, `${Date.now()}${ext}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
            cb(null, true)
        } else {
            console.log("Only jpg & png file supported!")
            cb(new Error("Unsupported file type"), false)
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 2
    }
})

module.exports = upload; */

const multer = require('multer');
const { GridFSBucket } = require('mongodb');
const path = require('path');
const mongoose = require('mongoose');

// Configurar almacenamiento temporal con multer
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
            cb(null, true);
        } else {
            console.log('Only jpg & png files are supported!');
            cb(new Error('Unsupported file type'), false);
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 2
    }
});

const uploadFileToGridFS = (req, res, next) => {
    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: 'uploads' });

    if (!req.file) {
        return next()
    }
    const uploadStream = bucket.openUploadStream(`${Date.now()}${path.extname(req.file.originalname)}`);
    uploadStream.end(req.file.buffer);
    uploadStream.on('finish', () => {
        req.file.id = uploadStream.id;
        next();
    });
};

module.exports = { upload, uploadFileToGridFS };



