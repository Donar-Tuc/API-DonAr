const express = require("express");
const router = express.Router();
const { getFundaciones, getFundacionesPorEtiqueta, getFundacion, updateFundacion, deleteFundacion, loginFundacion, registerFundacion } = require("../controllers/fundaciones");
const { authUser } = require("../middleware/authUser");
const { upload, uploadFileToGridFS } = require("../middleware/upload");

router.get("/", getFundaciones);

router.get("/etiqueta", getFundacionesPorEtiqueta);

router.get("/:id", getFundacion);

router.put("/:id", authUser, upload.single("logo"), uploadFileToGridFS, updateFundacion);

router.delete("/:id", authUser, deleteFundacion);

router.post("/login", upload.none(), loginFundacion);

router.post("/register", upload.single("logo"), uploadFileToGridFS, registerFundacion);

module.exports = router;
