import type { Metadata } from "next";
import "./globals.css"; // varsa

// Embed JSON'un sabit hali
const embed = {
  version: "1",
  imageUrl: "https://relationnft.vercel.app/image.png", // 3:2 oran, <10MB
  button: {
    title: "Open RelationNFT",
    action: {
      type: "launch_miniapp",
      url: "https://relationnft.vercel.app",
    },
  },
};

export const metadata: Metadata = {
  title: "RelationNFT",
  description: "Transform your Farcaster connections into valuable NFTs on Base",
  openGraph: {
    title: "RelationNFT",
    description:
      "Transform your Farcaster connections into valuable NFTs on Base",
    url: "https://relationnft.vercel.app",
    images: ["https://relationnft.vercel.app/image.png"],
  },
  // Burada özel meta'ları veriyoruz
  other: {
    "fc:miniapp": JSON.stringify(embed),
    // (Opsiyonel) geri uyumluluk
    "fc:frame": JSON.stringify(embed),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
