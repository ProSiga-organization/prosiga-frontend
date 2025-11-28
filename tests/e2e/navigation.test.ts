import { By, until } from 'selenium-webdriver'
import { TestSetup } from '../setup'

describe('Navigation E2E Tests', () => {
  let testSetup: TestSetup

  beforeAll(async () => {
    // Usar URL de produção
    testSetup = new TestSetup('https://prosiga-frontend.vercel.app')
    await testSetup.initialize()
  })

  afterAll(async () => {
    await testSetup.quit()
  })

  test('Deve navegar para página inicial', async () => {
    const driver = testSetup.driver!
    await testSetup.navigateTo('/')
    await driver.sleep(2000)

    const title = await driver.getTitle()
    expect(title).toBe('PróSiga')
  })

  test('Deve verificar se VLibras está presente', async () => {
    const driver = testSetup.driver!
    await testSetup.navigateTo('/')

    // Aguardar carregamento do VLibras
    await driver.sleep(3000)

    const vlibrasButton = await driver.wait(
      until.elementLocated(By.css('[vw-access-button]')),
      10000
    )
    
    expect(vlibrasButton).toBeTruthy()
    
    // Pausa final para visualizar
    await driver.sleep(2000)
  })
})
