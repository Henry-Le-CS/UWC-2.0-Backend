const express = require("express");
const userController = require("../controllers/userControllers");
const app = express();
const router = express.Router();

router.post("/infoBO",userController.infoBO);

module.exports = router;