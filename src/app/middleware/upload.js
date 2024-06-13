const path = require("path")
const multer = require("multer")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./src/app/uploads")
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

module.exports = upload;

