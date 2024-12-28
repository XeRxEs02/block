require('dotenv').config();  // Load environment variables
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { ethers } = require('ethers');
const mongoose = require('mongoose');

// Initialize the Express app
const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// MongoDB Schema for storing proposals
const proposalSchema = new mongoose.Schema({
  proposalText: String,
  proposalId: Number,
  createdAt: { type: Date, default: Date.now }
});

const Proposal = mongoose.model('Proposal', proposalSchema);

// Connect to Ethereum network using Infura or Alchemy (or your own provider)
const provider = new ethers.JsonRpcProvider(process.env.INFURA_URL); // Example: using Infura
const blockchainRoutes = require("./routes/blockchain");
app.use("/blockchain", blockchainRoutes);

// Wallet address of the deployer (private key for signing transactions)
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Contract address and ABI from your deployment
const contractAddress = process.env.CONTRACT_ADDRESS;
const contractABI = [
  // Add your contract ABI here. For example:
  "function getGovernanceDetails() view returns (address, uint256)",
  "function submitProposal(string memory proposalText) public",
  "function voteOnProposal(uint256 proposalId, bool vote) public",
  "function getAllProposals() view returns (string[] memory, bool[] memory)",
];

// Create contract instance
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// Route to get contract details
app.get('/contract/details', async (req, res) => {
  try {
    // Fetch contract details (for example, the contract address)
    const details = await contract.getGovernanceDetails();
    res.json({
      contractAddress: details[0], // Example: address of the contract
      proposalsCount: details[1],  // Example: number of proposals
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch contract details.' });
  }
});

// Route to submit a proposal
app.post('/proposal/submit', async (req, res) => {
  const { proposalText } = req.body;
  
  if (!proposalText) {
    return res.status(400).json({ error: 'Proposal text is required.' });
  }

  try {
    // Submit a proposal to the smart contract
    const tx = await contract.submitProposal(proposalText);
    await tx.wait();  // Wait for the transaction to be mined

    // Save the proposal to MongoDB
    const newProposal = new Proposal({
      proposalText,
      proposalId: tx.hash,  // For example, using the transaction hash as the proposal ID
    });

    await newProposal.save();

    res.json({ message: 'Proposal submitted successfully.', txHash: tx.hash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit proposal.' });
  }
});

// Route to vote on a proposal
app.post('/proposal/vote', async (req, res) => {
  const { proposalId, vote } = req.body;

  if (proposalId === undefined || vote === undefined) {
    return res.status(400).json({ error: 'Proposal ID and vote are required.' });
  }

  try {
    // Vote on the proposal in the smart contract
    const tx = await contract.voteOnProposal(proposalId, vote);
    await tx.wait();  // Wait for the transaction to be mined

    res.json({ message: 'Vote successfully casted.', txHash: tx.hash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to cast vote.' });
  }
});

// Route to get all proposals from the database
app.get('/proposals', async (req, res) => {
  try {
    // Fetch all proposals stored in MongoDB
    const proposals = await Proposal.find();
    res.json({ proposals });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch proposals.' });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
