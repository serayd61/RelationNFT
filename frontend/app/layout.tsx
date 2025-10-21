import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers"; // eğer default export değilse { Providers } bırak

// Base/Farcaster Mini App Embed (3:2 görsel, <10MB, https)
const embed = {
  version: "1",
  imageUrl: "https://relationnft.vercel.app/image.png?v=1",
  button: {
    title: "Launch RelationNFT",
    action: {
      type: "launch_miniapp",                 // <- doğru değer
      url: "https://relationnft.vercel.app",
      splashImageUrl: "https://relationnft.vercel.app/splash.png?v=1",
      splashBackgroundColor: "#5b21b6"
    }
  }
};

export const metadata: Metadata = {
  title: "RelationNFT - NFT your connections",
  description:
    "Mint dual NFTs that celebrate Farcaster relationships. Hit milestones with friends and unlock collectibles that immortalize your connections on-chain.",
  // Icons
  icons: {
    icon: "/icon.png?v=1",
    apple: "/icon.png?v=1"
  },
  // Open Graph
  openGraph: {
    title: "Farcaster Relationship NFTs",
    description: "Transform your Farcaster connections into valuable NFTs on Base",
    url: "https://relationnft.vercel.app",
    siteName: "RelationNFT",
    images: [
      {
        url: "https://relationnft.vercel.app/image.png?v=1", // og-image.png yerine image.png
        width: 1200,
        height: 630,
        alt: "RelationNFT - Farcaster Relationship NFTs"
      }
    ],
    type: "website",
    locale: "en_US"
  },
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Farcaster Relationship NFTs",
    description: "Transform your Farcaster connections into valuable NFTs on Base",
    images: ["https://relationnft.vercel.app/image.png?v=1"],
    creator: "@relationnft"
  },
  // Mini App embed metaları
  other: {
    "fc:miniapp": JSON.stringify(embed),
    // Geri uyumluluk (eski istemciler)
    "fc:frame": JSON.stringify({
      ...embed,
      button: {
        ...embed.button,
        action: { ...embed.button.action, type: "launch_frame" }
      }
    }),
    "fc:frame:image": "https://relationnft.vercel.app/image.png?v=1",
    "fc:frame:image:aspect_ratio": "3:2"
  },
  manifest: "/manifest.json",
  keywords: [
    "Farcaster",
    "NFT",
    "Base",
    "Blockchain",
    "Social",
    "Relationships",
    "Web3"
  ],
  applicationName: "RelationNFT",
  authors: [{ name: "relationnft", url: "https://warpcast.com/relationnft" }],
  themeColor: "#5b21b6"
};

// Viewport (Next 14+ ayrı export)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"> {/* ✅ EN dil etiketi ekle */}
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
