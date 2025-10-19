import { NextResponse } from 'next/server';

const DOMAIN = 'relationnft.vercel.app';

export async function GET() {
  const manifest = {
    accountAssociation: {
      header: "",
      payload: "",
      signature: ""
    },
    miniapp: {
      version: "1",
      name: "RelationNFT",
      subtitle: "Farcaster Relationship NFTs",
      description: "Transform your Farcaster connections into valuable NFTs",
      iconUrl: `https://${DOMAIN}/icon.png`,
      splashImageUrl: `https://${DOMAIN}/splash.png`,
      splashBackgroundColor: "#5b21b6",
      homeUrl: `https://${DOMAIN}`,
      webhookUrl: `https://relationnft-backend-kbkx5u46l-serkans-projects-9991a7f3.vercel.app/api/farcaster/webhook`,
      primaryCategory: "social",
      tags: ["nft", "social", "farcaster", "relationships"]
    }
  };

  return NextResponse.json(manifest);
}
