const express = require("express");
const router = express.Router();
const { getFundaciones, getFundacionesPorEtiqueta, getFundacion, createFundacion, updateFundacion, deleteFundacion } = require("../controllers/fundaciones");
const { authUser } = require("../middleware/authUser");
const { upload, uploadFileToGridFS } = require("../middleware/upload");

router.get("/", getFundaciones);

router.get("/etiqueta", getFundacionesPorEtiqueta);

router.get("/:id", getFundacion);

router.post("/", authUser, upload.single("logo"), uploadFileToGridFS, createFundacion);

router.put("/:id", authUser, upload.single("logo"), uploadFileToGridFS, updateFundacion);

router.delete("/:id", authUser, deleteFundacion);

module.exports = router;
