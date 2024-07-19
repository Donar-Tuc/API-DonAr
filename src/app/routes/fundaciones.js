const express = require("express");
const router = express.Router();
const { getFundaciones, getFundacionesPorEtiqueta, getFundacion, updateFundacion, deleteFundacion, loginFundacion, registerFundacion, changePasswordFundacion } = require("../controllers/fundaciones");
const { authUser } = require("../middleware/authUser");
const { upload, uploadFileToGridFS } = require("../middleware/upload");

/* GET */

router.get("/", getFundaciones);

router.get("/etiqueta", getFundacionesPorEtiqueta);

router.get("/:id", getFundacion);

/* PUT */

router.put("/:id", authUser, upload.single("logo"), uploadFileToGridFS, updateFundacion);

router.put("/:id/change-password", authUser, upload.none(), changePasswordFundacion);

/* REGISTER/LOGIN POST */

router.post("/login", upload.none(), loginFundacion);

router.post("/register", upload.single("logo"), uploadFileToGridFS, registerFundacion);

/* DELETE */

router.delete("/:id/delete-account", authUser, upload.none(), deleteFundacion);

module.exports = router;
