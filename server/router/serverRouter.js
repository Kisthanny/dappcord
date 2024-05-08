const express = require("express");
const {
  addServer,
  getServers,
  getServerByAddress,
} = require("../controllers/serverControllers");
const { toLowerCaseMiddleware } = require("../middleware/index");
const router = express.Router();

router.get("/", getServers);

router.get("/:address", toLowerCaseMiddleware(["address"]), getServerByAddress);

router.post("/add", toLowerCaseMiddleware(["address", "owner"]), addServer);

module.exports = router;
