const express = require("express");
const auth = require("../middleware/auth");
const { createProposal, getProposals } = require("../controllers/proposalController");

const router = express.Router();

router.post("/", auth, createProposal);
router.get("/", getProposals);

module.exports = router;
