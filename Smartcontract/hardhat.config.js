require("@nomicfoundation/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: "0.8.28",
  networks: {
    ropsten: {
      url:"https://mainnet.infura.io/v3/aa9bf3050ea342829c2fc9997276e846",
      accounts: [`0xd1d1249a071e289b3b2e36b0db42109dffd995e46ba739fede40108faf6dcf9e`]
    }
  }
};
