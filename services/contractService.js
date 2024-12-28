const { ethers } = require("ethers");
const { provider, wallet } = require("../config/blockchain");
const contractABI = require("../config/contractABI.json");

const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

/**
 * Create a new proposal
 */
async function createProposal(title, description) {
    try {
        const tx = await contract.createProposal(title, description);
        await tx.wait();
        console.log("Proposal created:", tx.hash);
        return tx.hash;
    } catch (err) {
        console.error("Error creating proposal:", err);
        throw err;
    }
}

/**
 * Vote for a proposal
 */
async function vote(proposalId) {
    try {
        const tx = await contract.vote(proposalId);
        await tx.wait();
        console.log("Voted successfully:", tx.hash);
        return tx.hash;
    } catch (err) {
        console.error("Error voting:", err);
        throw err;
    }
}

/**
 * Fetch all proposals
 */
async function fetchProposals() {
    try {
        const proposals = await contract.getProposals();
        console.log("Fetched Proposals:", proposals);
        return proposals;
    } catch (err) {
        console.error("Error fetching proposals:", err);
        throw err;
    }
}

module.exports = { createProposal, vote, fetchProposals };
