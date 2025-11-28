import { Builder, WebDriver, Browser } from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome'

export class TestSetup {
  driver: WebDriver | null = null
  baseUrl: string

  constructor(baseUrl: string = 'http://localhost:3000') {
    this.baseUrl = baseUrl
  }

  async initialize() {
    const options = new chrome.Options()
    // Modo com interface gráfica para visualizar os testes
    options.addArguments('--no-sandbox')
    options.addArguments('--disable-dev-shm-usage')
    options.addArguments('--start-maximized') // Inicia maximizado
    options.addArguments('--disable-blink-features=AutomationControlled') // Remove banner de automação

    this.driver = await new Builder()
      .forBrowser(Browser.CHROME)
      .setChromeOptions(options)
      .build()

    await this.driver.manage().setTimeouts({ implicit: 10000 })
    await this.driver.manage().window().maximize() // Maximiza a janela
    return this.driver
  }

  async quit() {
    if (this.driver) {
      await this.driver.quit()
    }
  }

  async navigateTo(path: string) {
    if (!this.driver) {
      throw new Error('Driver not initialized')
    }
    await this.driver.get(`${this.baseUrl}${path}`)
  }
}
