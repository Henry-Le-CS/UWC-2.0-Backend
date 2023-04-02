const express = require("express");
const boController = require("../controllers/boControllers");
const app = express();
const router = express.Router();

router.get("/viewMCP", boController.viewMCP);
router.post("/infoBO", boController.infoBO);
router.get("/viewWorker", boController.viewWorker)
module.exports = router;
