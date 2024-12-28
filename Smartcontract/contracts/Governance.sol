// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Governance {
    struct Proposal {
        string title;
        string description;
        uint256 votes;
        address creator;
        bool active;
    }

    Proposal[] public proposals;

    function createProposal(string memory _title, string memory _description) public {
        proposals.push(Proposal({
            title: _title,
            description: _description,
            votes: 0,
            creator: msg.sender,
            active: true
        }));
    }

    function vote(uint256 proposalId) public {
        require(proposals[proposalId].active, "Proposal is not active");
        proposals[proposalId].votes += 1;
    }

    function closeProposal(uint256 proposalId) public {
        require(msg.sender == proposals[proposalId].creator, "Only the creator can close the proposal");
        proposals[proposalId].active = false;
    }

    function getProposals() public view returns (Proposal[] memory) {
        return proposals;
    }
}
