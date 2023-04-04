const express = require("express");
const boController = require("../controllers/boControllers");
const app = express();
const router = express.Router();

router.get("/viewMCP", boController.viewMCP);
router.get("/viewWorker", boController.viewWorker)
router.get("/viewGroup",boController.viewGroup);
router.get("/viewVehicle",boController.viewVehicle)
router.post("/infoBO", boController.infoBO);
router.post("/assignUser",boController.assignUser);
router.post("/assignVehicle",boController.assignVehicle);

module.exports = router;
