export default function RootLayout({ children }: { children: React.ReactNode }) {
  const embed = {
    version: "1",
    imageUrl: "https://relationnft.vercel.app/image.png", // 3:2, <10MB
    button: {
      title: "Open RelationNFT",
      action: {
        type: "launch_miniapp",
        url: "https://relationnft.vercel.app"
      }
    }
  };

  return (
    <html lang="en">
      <head>
        {/* Farcaster/Base Mini App Embed */}
        <meta name="fc:miniapp" content={JSON.stringify(embed)} />
        {/* (Opsiyonel) Geri uyumluluk */}
        <meta
          name="fc:frame"
          content={JSON.stringify({
            ...embed,
            button: { ...embed.button, action: { ...embed.button.action } }
          })}
        />
        {/* OG tagleri (opsiyonel ama faydalı) */}
        <meta property="og:title" content="RelationNFT" />
        <meta property="og:description" content="Transform your Farcaster connections into valuable NFTs on Base" />
        <meta property="og:image" content="https://relationnft.vercel.app/image.png" />
        <meta property="og:url" content="https://relationnft.vercel.app" />
      </head>
      <body>{children}</body>
    </html>
  );
}
