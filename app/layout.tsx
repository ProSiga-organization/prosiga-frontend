import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from "@/components/ui/sonner"
import { VLibrasWidget } from '@/components/vlibras-widget'
import './globals.css'

export const metadata: Metadata = {
  title: 'PróSiga',
  description: 'Sistema de Gerenciamento Acadêmico',
  icons: {
    icon: '/icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans antialiased ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Toaster richColors />
        <Analytics />
        <VLibrasWidget />
      </body>
    </html>
  )
}
