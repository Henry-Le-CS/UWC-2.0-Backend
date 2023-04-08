const express = require("express");
const workerController = require("../controllers/workerControllers");
const app = express();
const router = express.Router();
router.post("/findGroups",workerController.findGroups)
module.exports = router;