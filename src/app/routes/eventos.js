const express  = require("express");
const router = express.Router();
const { getEventos, getEvento, createEvento, updateEvento, deleteEvento } = require("../controllers/eventos");
const { authUser } = require("../middleware/authUser");
const { upload, uploadFileToGridFS } = require("../middleware/upload");


router.get("/", getEventos);

router.get("/:id", getEvento);

router.post("/", authUser, upload.single("logo"), uploadFileToGridFS, createEvento);

router.put("/:id", authUser, upload.single("logo"), uploadFileToGridFS, updateEvento);

router.delete("/:id/delete-event", authUser,  upload.none(), deleteEvento);

module.exports = router;
