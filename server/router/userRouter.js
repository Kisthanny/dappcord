const express = require("express");
const {
  addUser,
  addServerCollection,
  getServerCollection,
} = require("../controllers/userControllers");
const { toLowerCaseMiddleware } = require("../middleware/index");
const router = express.Router();

router.post("/add", toLowerCaseMiddleware(["address"]), addUser);

router.post(
  "/addServerCollection",
  toLowerCaseMiddleware(["user", "server"]),
  addServerCollection
);

router.get("/serverCollection/:address", toLowerCaseMiddleware(["address"]), getServerCollection);

module.exports = router;
