import './globals.css'
import 'flag-icons/css/flag-icons.min.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BabelLM',
  description: 'Ask questions in different languages',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.7.0/css/flag-icons.min.css" />
      </head>
      <body>{children}</body>
    </html>
  )
}
