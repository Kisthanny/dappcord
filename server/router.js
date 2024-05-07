const express = require("express");
const router = express.Router();
const { servers } = require("./data/data");

router.get("/", (req, res) => {
  res.send("server is up and running");
});

router.get("/api/server", (req, res) => {
  res.send(servers);
});

router.get("/api/server/:address", (req, res) => {
  const { address } = req.params;
  const result = servers.find(
    (server) =>
      server.address.toLocaleLowerCase() === address.toLocaleLowerCase()
  );
  res.send(result);
});

module.exports = router;
