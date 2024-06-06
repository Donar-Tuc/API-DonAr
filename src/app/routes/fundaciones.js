const express  = require("express");
const router = express.Router();
const { getFundaciones, getFundacionesPorEtiquetas, getFundacion, createFundacion, updateFundacion, deleteFundacion } = require("../controllers/fundaciones");
const { authUser } = require("../middleware/authUser");

router.get("/", getFundaciones);

router.get("/:etiqueta", getFundacionesPorEtiquetas);

router.get("/:id", getFundacion);

router.post("/", authUser, createFundacion);

router.put("/:id", authUser, updateFundacion);

router.delete("/:id", authUser, deleteFundacion);

module.exports = router;
