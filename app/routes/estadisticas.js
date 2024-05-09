const express = require("express");
const router = express.Router();
const { getEstadisticas } = require("../controllers/estadisticas");
const { authUser } = require("../middleware/authUser");

router.get("/", authUser, getEstadisticas);

module.exports = router;