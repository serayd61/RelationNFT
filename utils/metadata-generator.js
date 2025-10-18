/**
 * NFT Metadata & Dynamic Image Generator
 * Generates unique, beautiful NFT metadata and SVG images for each relationship
 */

// Color schemes for different milestone types
const MILESTONE_COLORS = {
  FIRST_SUPPORTER: {
    primary: '#FFD700',
    secondary: '#FFA500',
    gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    emoji: '🌟',
    name: 'First Supporter'
  },
  CONVERSATION_PARTNER: {
    primary: '#8B5CF6',
    secondary: '#6366F1',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
    emoji: '💬',
    name: 'Conversation Partner'
  },
  CO_CREATOR: {
    primary: '#3B82F6',
    secondary: '#06B6D4',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
    emoji: '🛠️',
    name: 'Co-Creator'
  },
  MUTUAL_WHALE: {
    primary: '#FB5607',
    secondary: '#FF006E',
    gradient: 'linear-gradient(135deg, #FB5607 0%, #FF006E 100%)',
    emoji: '🐋',
    name: 'Mutual Whale'
  },
  GOLDEN_BOND: {
    primary: '#FFD60A',
    secondary: '#FFC300',
    gradient: 'linear-gradient(135deg, #FFD60A 0%, #FFC300 100%)',
    emoji: '💎',
    name: 'Golden Bond'
  },
  COMMUNITY_BUILDER: {
    primary: '#10B981',
    secondary: '#059669',
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    emoji: '🏗️',
    name: 'Community Builder'
  },
  EARLY_ADOPTER: {
    primary: '#EC4899',
    secondary: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
    emoji: '🚀',
    name: 'Early Adopter'
  }
};

/**
 * Generate SVG image for NFT
 */
function generateNFTSVG(user1, user2, milestoneType, interactionCount, tipsExchanged) {
  const colors = MILESTONE_COLORS[milestoneType];
  const date = new Date().toLocaleDateString();
  
  return `
    <svg width="1000" height="1000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
        </linearGradient>
        
        <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:rgba(255,255,255,0.1);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgba(255,255,255,0.05);stop-opacity:1" />
        </linearGradient>
        
        <filter id="glow">
          <feGaussianBlur stdDeviation="10" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic
