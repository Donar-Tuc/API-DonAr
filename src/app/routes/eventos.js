const express  = require("express");
const router = express.Router();
const { getEventos, getEvento, createEvento, updateEvento, deleteEvento } = require("../controllers/eventos");
const { authUser } = require("../middleware/authUser");

router.get("/", authUser, getEventos);

router.get("/:id", authUser, getEvento);

router.post("/", authUser, createEvento);

router.put("/:id", authUser, updateEvento);

router.delete("/:id", authUser, deleteEvento);

module.exports = router;