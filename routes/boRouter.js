const express = require("express");
const boController = require("../controllers/boControllers");
const app = express();
const router = express.Router();

router.get("/viewMCP", boController.viewMCP);
router.get("/viewWorker", boController.viewWorker)
router.post("/infoBO", boController.infoBO);
router.post("/assignUser",boController.assignUser);
module.exports = router;
