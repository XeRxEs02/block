const mongoose = require("mongoose");

const ProposalSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    creator: { type: String, required: true }, // Ethereum wallet address
    votes: { type: Number, default: 0 },
    status: { type: String, default: "active" }, // active, approved, rejected
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Proposal", ProposalSchema);
