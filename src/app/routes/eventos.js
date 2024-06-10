const express  = require("express");
const router = express.Router();
const { getEventos, getEvento, createEvento, updateEvento, deleteEvento } = require("../controllers/eventos");
const { authUser } = require("../middleware/authUser");

router.get("/", getEventos);

router.get("/:id", getEvento);

router.post("/", createEvento);

router.put("/:id", authUser, updateEvento);

router.delete("/:id", authUser, deleteEvento);

module.exports = router;
