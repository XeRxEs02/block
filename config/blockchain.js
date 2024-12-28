const { ethers } = require("ethers");
require("dotenv").config(); // Ensure environment variables are loaded

if (!process.env.INFURA_URL) {
  throw new Error("INFURA_URL is not defined in the .env file");
}

const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_URL);

module.exports = provider;
