import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from "@/components/ui/sonner"
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
      <head>
        <script src="https://vlibras.gov.br/app/vlibras-plugin.js"></script>
      </head>
      <body className={`font-sans antialiased ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Toaster richColors />
        <Analytics />
        <div data-vw="true" className="enabled">
          <div data-vw-access-button="true" className="active"></div>
          <div data-vw-plugin-wrapper="true">
            <div className="vw-plugin-top-wrapper"></div>
          </div>
        </div>
        <script dangerouslySetInnerHTML={{ __html: 'new window.VLibras.Widget("https://vlibras.gov.br/app");' }} />
      </body>
    </html>
  )
}
