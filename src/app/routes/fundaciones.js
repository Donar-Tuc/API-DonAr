const express = require("express");
const router = express.Router();
const { getFundaciones, getFundacionesPorEtiqueta } = require("../controllers/fundaciones");

router.get("/", getFundaciones);

router.get("/etiqueta", getFundacionesPorEtiqueta);

module.exports = router;