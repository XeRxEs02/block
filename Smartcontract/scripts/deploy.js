async function main() {
  // Get the contract factory
  const { ethers } = require("hardhat");

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Get the contract factory for the Governance contract
  const Governance = await ethers.getContractFactory("Governance");

  // Deploy the contract
  const governance = await Governance.deploy();

  console.log("Governance contract deployed to:", governance.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error);
      process.exit(1);
  });
