const Proposal = require("../models/Proposal");

exports.createProposal = async (req, res) => {
    try {
        const { title, description } = req.body;
        const proposal = new Proposal({
            title,
            description,
            creator: req.user.walletAddress,
        });
        await proposal.save();
        res.status(201).send("Proposal created");
    } catch (err) {
        res.status(400).send(err.message);
    }
};

exports.getProposals = async (req, res) => {
    try {
        const proposals = await Proposal.find();
        res.send(proposals);
    } catch (err) {
        res.status(400).send(err.message);
    }
};
