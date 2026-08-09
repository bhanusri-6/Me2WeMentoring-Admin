const express = require("express");
const router = express.Router();

const {
  login,
  createAdmin,
} = require("../controllers/adminController");

router.post("/login", login);
router.post("/create", createAdmin);

module.exports = router;