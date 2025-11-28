'use client'

import { useEffect } from 'react'
import Script from 'next/script'

export function VLibrasWidget() {
  useEffect(() => {
    const initVLibras = () => {
      if (window.VLibras) {
        new window.VLibras.Widget('https://vlibras.gov.br/app')
      }
    }

    if (document.readyState === 'complete') {
      initVLibras()
    } else {
      window.addEventListener('load', initVLibras)
      return () => window.removeEventListener('load', initVLibras)
    }
  }, [])

  return (
    <>
      <Script
        src="https://vlibras.gov.br/app/vlibras-plugin.js"
        strategy="afterInteractive"
      />
      <div vw-access-button="true" className="enabled" />
    </>
  )
}

declare global {
  interface Window {
    VLibras: {
      Widget: new (baseUrl: string) => void
    }
  }
}
