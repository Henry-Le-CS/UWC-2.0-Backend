const express = require("express");
const userController = require("../controllers/userControllers");
const app = express();
const router = express.Router();

router.post("/login",userController.login);

module.exports = router;