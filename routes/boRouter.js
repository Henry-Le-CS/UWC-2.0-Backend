const express = require("express");
const boController = require("../controllers/boControllers");
const app = express();
const router = express.Router();

router.get("/viewMCP", boController.viewMCP);
router.get("/viewWorker", boController.viewWorker)
router.get("/viewGroup",boController.viewGroup);
router.get("/viewVehicle",boController.viewVehicle);
router.post("/infoBO/listMessages", boController.listMessages);
router.post("/infoBO/getAvaUrl", boController.getAvaUrl);
// console.log(boController.listMessages)
//get message

router.post("/findGroup",boController.findGroup)
router.post("/infoBO", boController.infoBO);
router.post("/assignUser",boController.assignUser);
router.post("/assignVehicle",boController.assignVehicle);
router.post("/removeGroup",boController.removeGroup);
router.post("/findWorker",boController.findWorker)
router.post("/listInfo",boController.listInfo)
router.post("/writeDescription",boController.writeDescription)

module.exports = router;
