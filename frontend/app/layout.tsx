import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

// Base Mini App Embed Configuration
const embed = {
  version: "1",
  imageUrl: "https://relationnft.vercel.app/image.png", // 3:2 aspect ratio, <10MB
  button: {
    title: "Launch RelationNFT",
    action: {
      type: "launch_frame",
      url: "https://relationnft.vercel.app",
    },
  },
};

export const metadata: Metadata = {
  title: "RelationNFT - NFT your connections",
  description:
    "Mint dual NFTs that celebrate Farcaster relationships. Hit milestones with friends and unlock collectibles that immortalize your connections on-chain.",
  
  // Icons
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },

  // Open Graph
  openGraph: {
    title: "Farcaster Relationship NFTs",
    description:
      "Transform your Farcaster connections into valuable NFTs on Base",
    url: "https://relationnft.vercel.app",
    siteName: "RelationNFT",
    images: [
      {
        url: "https://relationnft.vercel.app/image.png",
        width: 1200,
        height: 630,
        alt: "RelationNFT - Farcaster Relationship NFTs",
      },
    ],
    type: "website",
    locale: "en_US",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Farcaster Relationship NFTs",
    description:
      "Transform your Farcaster connections into valuable NFTs on Base",
    images: ["https://relationnft.vercel.app/image.png"],
    creator: "@relationnft",
  },

  // Base Mini App specific metadata
  other: {
    // Primary miniapp metadata (new standard)
    "fc:miniapp": JSON.stringify(embed),
    
    // Backward compatibility
    "fc:frame": JSON.stringify(embed),
    
    // Additional metadata for better discoverability
    "fc:frame:image": "https://relationnft.vercel.app/image.png",
    "fc:frame:image:aspect_ratio": "3:2",
  },

  // Manifest
  manifest: "/manifest.json",

  // Keywords for SEO
  keywords: [
    "Farcaster",
    "NFT",
    "Base",
    "Blockchain",
    "Social",
    "Relationships",
    "Web3",
  ],

  // App metadata
  applicationName: "RelationNFT",
  authors: [{ name: "relationnft", url: "https://warpcast.com/relationnft" }],
  
  // Theme color matching splash screen
  themeColor: "#5b21b6",
};

// Viewport must be exported separately in Next.js 14+
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical assets */}
        <link rel="preload" href="/icon.png" as="image" />
        
        {/* Additional meta tags for better compatibility */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="RelationNFT" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
