const express = require("express");
const workerController = require("../controllers/workerControllers");
const app = express();
const router = express.Router();
router.post("/findGroups",workerController.findGroups)
router.post("/listInfoTasks",workerController.listInfo)
module.exports = router;
