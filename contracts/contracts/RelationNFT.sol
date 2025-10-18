// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title RelationNFT
 * @dev NFT contract that creates dual tokens representing relationships on Farcaster
 * Each meaningful interaction milestone triggers NFT creation for both parties
 */
contract RelationNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // Milestone types
    enum MilestoneType {
        FIRST_SUPPORTER,      // First $1+ tip
        CONVERSATION_PARTNER, // 50+ interactions
        CO_CREATOR,          // Collaborative creation
        MUTUAL_WHALE,        // $100+ mutual tips
        GOLDEN_BOND,         // 100+ interactions + $50+ tips
        COMMUNITY_BUILDER,   // Brought 10+ new users
        EARLY_ADOPTER        // First 1000 users
    }

    // NFT Rarity levels
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
        uint256 totalTipsExchanged; // in wei
        uint256 mintedAt;
        string metadataURI;
        uint256 pairedTokenId; // ID of the partner's NFT
    }

    // Mapping from token ID to NFT data
    mapping(uint256 => RelationshipNFT) public relationshipNFTs;
    
    // Track relationships between addresses
    mapping(address => mapping(address => bool)) public hasRelationshipNFT;
    
    // Track user statistics
    mapping(address => uint256) public userNFTCount;
    mapping(address => uint256) public userTotalInteractions;
    
    // Authorized Farcaster oracle (backend that verifies interactions)
    address public farcasterOracle;
    
    // Minting fee (goes to protocol treasury)
    uint256 public mintFee = 0.001 ether; // ~$2 on Base network
    
    // Events
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
     * Called by the Farcaster oracle after verifying interactions
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

        // Determine rarity based on milestone type and stats
        Rarity rarity = _calculateRarity(milestoneType, interactionCount, totalTipsExchanged);

        // Mint NFT for user1
        uint256 tokenId1 = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(user1, tokenId1);
        _setTokenURI(tokenId1, metadataURI1);

        // Mint NFT for user2
        uint256 tokenId2 = _tokenIdCounter.current();
        _tokenIdCounter.increment();
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
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return relationshipNFTs[tokenId];
    }

    /**
     * @dev Get all NFT IDs owned by a user
     */
    function getUserNFTs(address user) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(user);
        uint256[] memory tokenIds = new uint256[](balance);
        uint256 counter = 0;
        
        for (uint256 i = 0; i < _tokenIdCounter.current(); i++) {
            if (_ownerOf(i) == user) {
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
        // This would be called by frontend to check if ready to mint
        // In production, oracle would verify this
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
        require(_ownerOf(tokenId) == msg.sender, "Not token owner");
        
        // Update relationship status
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

/**
 * DEPLOYMENT INSTRUCTIONS:
 * 
 * 1. Deploy to Base Network (Farcaster's preferred L2)
 * 2. Set farcasterOracle to your backend API address
 * 3. Verify contract on BaseScan
 * 4. Create metadata templates on IPFS
 * 5. Integrate with Farcaster Mini App
 * 
 * ESTIMATED GAS COSTS (on Base):
 * - Deployment: ~$10-15
 * - Mint dual NFT: ~$0.50-1.00
 * - View functions: Free
 */
