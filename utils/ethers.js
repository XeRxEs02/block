const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_URL);

const getWallet = () => {
    return new ethers.Wallet(process.env.PRIVATE_KEY, provider);
};

const getTokenBalance = async (walletAddress, tokenContractAddress) => {
    const abi = [
        "function balanceOf(address owner) view returns (uint256)",
        "function decimals() view returns (uint8)",
    ];
    const contract = new ethers.Contract(tokenContractAddress, abi, provider);

    const balance = await contract.balanceOf(walletAddress);
    const decimals = await contract.decimals();

    return ethers.utils.formatUnits(balance, decimals);
};

module.exports = {
    getWallet,
    getTokenBalance,
};
