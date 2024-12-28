const { getTokenBalance } = require("../utils/ethers");

exports.getUserTokenBalance = async (req, res) => {
    const { walletAddress, tokenContractAddress } = req.body;

    if (!walletAddress || !tokenContractAddress) {
        return res.status(400).send("Missing wallet address or token contract address");
    }

    try {
        const balance = await getTokenBalance(walletAddress, tokenContractAddress);
        res.status(200).send({ walletAddress, tokenContractAddress, balance });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error fetching token balance");
    }
};
