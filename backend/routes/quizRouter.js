const express = require("express");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

// Creating new quiz...
router.post("/quiz/:roundId", (req, res) => {
  const roundId = req.params.roundId;
  const body = req.body;

  res.status(200).json({ roundId, body });
});

module.exports = router;
