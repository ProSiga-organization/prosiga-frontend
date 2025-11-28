'use client'

import { useEffect } from 'react'

export function VLibrasWidget() {
  useEffect(() => {
    // Adiciona o script do VLibras
    const script = document.createElement('script')
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js'
    script.async = true
    script.onload = () => {
      // Inicializa o VLibras após o script carregar
      if (window.VLibras) {
        new window.VLibras.Widget('https://vlibras.gov.br/app')
      }
    }
    document.body.appendChild(script)

    return () => {
      // Cleanup quando o componente desmontar
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  return (
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
  )
}

declare global {
  interface Window {
    VLibras?: {
      Widget: new (baseUrl: string) => void
    }
  }
}
