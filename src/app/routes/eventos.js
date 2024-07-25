const express  = require("express");
const router = express.Router();
const { getEventos, getEvento, createEvento, updateEvento, deleteEvento } = require("../controllers/eventos");
const { authUser } = require("../middleware/authUser");

router.get("/", getEventos);

router.get("/:id", getEvento);

router.post("/", authUser, createEvento);

router.put("/:id", authUser, updateEvento);

router.delete("/:id/delete-event", authUser, deleteEvento);

module.exports = router;
