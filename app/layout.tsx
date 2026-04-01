import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LeaseLens | Compare Lease vs Buy',
  description: 'Compare the real cost of leasing vs financing your next car in Canada.',
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
