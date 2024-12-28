const express = require("express");
const { createProposal, vote, fetchProposals } = require("../services/contractService");

const router = express.Router();

// Create a Proposal
router.post("/proposals", async (req, res) => {
    const { title, description } = req.body;
    try {
        const txHash = await createProposal(title, description);
        res.send({ message: "Proposal created", txHash });
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Vote for a Proposal
router.post("/proposals/:id/vote", async (req, res) => {
    const { id } = req.params;
    try {
        const txHash = await vote(id);
        res.send({ message: "Voted successfully", txHash });
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Fetch Proposals
router.get("/proposals", async (req, res) => {
    try {
        const proposals = await fetchProposals();
        res.send(proposals);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

module.exports = router;
