const express = require("express");
const {
  addServerCollection,
  getServerCollection,
  authUser,
} = require("../controllers/userControllers");
const { toLowerCaseMiddleware } = require("../middleware/index");
const {
  signatureVerificationMiddleware,
} = require("../middleware/verifyMiddleware");
const router = express.Router();

router.post(
  "/login",
  toLowerCaseMiddleware(["address"]),
  signatureVerificationMiddleware,
  authUser
);

router.post(
  "/addServerCollection",
  toLowerCaseMiddleware(["user", "server"]),
  addServerCollection
);

router.get(
  "/serverCollection/:address",
  toLowerCaseMiddleware(["address"]),
  getServerCollection
);

module.exports = router;
