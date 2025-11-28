'use client'

import { useEffect } from 'react'
import Script from 'next/script'

export function VLibrasWidget() {
  const handleScriptLoad = () => {
    if (typeof window !== 'undefined' && window.VLibras) {
      new window.VLibras.Widget('https://vlibras.gov.br/app')
    }
  }

  return (
    <>
      <Script
        src="https://vlibras.gov.br/app/vlibras-plugin.js"
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
      />
      <div 
        dangerouslySetInnerHTML={{
          __html: `
            <div vw class="enabled">
              <div vw-access-button class="active"></div>
              <div vw-plugin-wrapper>
                <div class="vw-plugin-top-wrapper"></div>
              </div>
            </div>
          `
        }}
      />
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
