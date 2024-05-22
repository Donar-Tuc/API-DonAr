const express = require("express");
const router = express.Router();
const { login, register, getUsers } = require("../controllers/users");

router.get("/getUsers", getUsers);
router.post("/login", login);
router.post("/register", register);

module.exports = router;
