import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RelationNFT - Farcaster Relationship NFTs',
  description: 'Transform your Farcaster connections into valuable NFTs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
