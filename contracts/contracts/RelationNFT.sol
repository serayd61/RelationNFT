// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RelationNFT
 * @dev NFT contract that creates dual tokens representing relationships on Farcaster
 */
contract RelationNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    enum MilestoneType {
        FIRST_SUPPORTER,
        CONVERSATION_PARTNER,
        CO_CREATOR,
        MUTUAL_WHALE,
        GOLDEN_BOND,
        COMMUNITY_BUILDER,
        EARLY_ADOPTER
    }

    enum Rarity {
        COMMON,
        RARE,
        EPIC,
        LEGENDARY
    }

    struct RelationshipNFT {
        address user1;
        address user2;
        MilestoneType milestoneType;
        Rarity rarity;
        uint256 interactionCount;
        uint256 totalTipsExchanged;
        uint256 mintedAt;
        string metadataURI;
        uint256 pairedTokenId;
    }

    mapping(uint256 => RelationshipNFT) public relationshipNFTs;
    mapping(address => mapping(address => bool)) public hasRelationshipNFT;
    mapping(address => uint256) public userNFTCount;
    mapping(address => uint256) public userTotalInteractions;
    
    address public farcasterOracle;
    uint256 public mintFee = 0.001 ether;
    
    event RelationshipNFTMinted(
        uint256 indexed tokenId1,
        uint256 indexed tokenId2,
        address indexed user1,
        address user2,
        MilestoneType milestoneType
    );
    
    event MilestoneUnlocked(
        address indexed user1,
        address indexed user2,
        MilestoneType milestoneType
    );

    constructor(address _farcasterOracle) ERC721("RelationNFT", "RNFT") Ownable(msg.sender) {
        farcasterOracle = _farcasterOracle;
    }

    modifier onlyOracle() {
        require(msg.sender == farcasterOracle, "Only oracle can call");
        _;
    }

    /**
     * @dev Mint dual NFTs for a relationship milestone
     */
    function mintRelationshipNFT(
        address user1,
        address user2,
        MilestoneType milestoneType,
        uint256 interactionCount,
        uint256 totalTipsExchanged,
        string memory metadataURI1,
        string memory metadataURI2
    ) external payable onlyOracle {
        require(user1 != user2, "Cannot create relationship with self");
        require(!hasRelationshipNFT[user1][user2], "NFT already minted for this relationship");
        require(msg.value >= mintFee * 2, "Insufficient mint fee");

        Rarity rarity = _calculateRarity(milestoneType, interactionCount, totalTipsExchanged);

        // Mint NFT for user1
        uint256 tokenId1 = _tokenIdCounter;
        _tokenIdCounter++;
        _safeMint(user1, tokenId1);
        _setTokenURI(tokenId1, metadataURI1);

        // Mint NFT for user2
        uint256 tokenId2 = _tokenIdCounter;
        _tokenIdCounter++;
        _safeMint(user2, tokenId2);
        _setTokenURI(tokenId2, metadataURI2);

        // Store relationship data for both NFTs
        relationshipNFTs[tokenId1] = RelationshipNFT({
            user1: user1,
            user2: user2,
            milestoneType: milestoneType,
            rarity: rarity,
            interactionCount: interactionCount,
            totalTipsExchanged: totalTipsExchanged,
            mintedAt: block.timestamp,
            metadataURI: metadataURI1,
            pairedTokenId: tokenId2
        });

        relationshipNFTs[tokenId2] = RelationshipNFT({
            user1: user2,
            user2: user1,
            milestoneType: milestoneType,
            rarity: rarity,
            interactionCount: interactionCount,
            totalTipsExchanged: totalTipsExchanged,
            mintedAt: block.timestamp,
            metadataURI: metadataURI2,
            pairedTokenId: tokenId1
        });

        // Update mappings
        hasRelationshipNFT[user1][user2] = true;
        hasRelationshipNFT[user2][user1] = true;
        userNFTCount[user1]++;
        userNFTCount[user2]++;
        userTotalInteractions[user1] += interactionCount;
        userTotalInteractions[user2] += interactionCount;

        emit RelationshipNFTMinted(tokenId1, tokenId2, user1, user2, milestoneType);
    }

    /**
     * @dev Calculate NFT rarity based on achievement
     */
    function _calculateRarity(
        MilestoneType milestoneType,
        uint256 interactionCount,
        uint256 totalTipsExchanged
    ) internal pure returns (Rarity) {
        if (milestoneType == MilestoneType.EARLY_ADOPTER || milestoneType == MilestoneType.MUTUAL_WHALE) {
            return Rarity.LEGENDARY;
        }
        
        if (milestoneType == MilestoneType.GOLDEN_BOND || totalTipsExchanged > 100 ether) {
            return Rarity.EPIC;
        }
        
        if (milestoneType == MilestoneType.CO_CREATOR || interactionCount > 100) {
            return Rarity.RARE;
        }
        
        return Rarity.COMMON;
    }

    /**
     * @dev Get relationship details for a specific NFT
     */
    function getRelationshipDetails(uint256 tokenId) 
        external 
        view 
        returns (RelationshipNFT memory) 
    {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return relationshipNFTs[tokenId];
    }

    /**
     * @dev Get all NFT IDs owned by a user
     */
    function getUserNFTs(address user) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(user);
        uint256[] memory tokenIds = new uint256[](balance);
        uint256 counter = 0;
        
        for (uint256 i = 0; i < _tokenIdCounter; i++) {
            if (ownerOf(i) == user) {
                tokenIds[counter] = i;
                counter++;
            }
        }
        
        return tokenIds;
    }

    /**
     * @dev Check if milestone is unlocked between two users
     */
    function checkMilestone(
        address user1,
        address user2,
        MilestoneType milestoneType
    ) external view returns (bool) {
        return !hasRelationshipNFT[user1][user2];
    }

    /**
     * @dev Update oracle address (admin only)
     */
    function setFarcasterOracle(address _newOracle) external onlyOwner {
        farcasterOracle = _newOracle;
    }

    /**
     * @dev Update mint fee (admin only)
     */
    function setMintFee(uint256 _newFee) external onlyOwner {
        mintFee = _newFee;
    }

    /**
     * @dev Withdraw accumulated fees (admin only)
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        payable(owner()).transfer(balance);
    }

    /**
     * @dev Burn NFT (only owner can burn their own)
     */
    function burn(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        
        RelationshipNFT memory nft = relationshipNFTs[tokenId];
        hasRelationshipNFT[nft.user1][nft.user2] = false;
        hasRelationshipNFT[nft.user2][nft.user1] = false;
        
        _burn(tokenId);
        delete relationshipNFTs[tokenId];
    }

    // Required overrides
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
