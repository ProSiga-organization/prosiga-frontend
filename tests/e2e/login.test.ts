import { By, until } from 'selenium-webdriver'
import { TestSetup } from '../setup'

describe('Login E2E Tests', () => {
  let testSetup: TestSetup

  beforeAll(async () => {
    // Usar URL de produção
    testSetup = new TestSetup('https://prosiga-frontend.vercel.app')
    await testSetup.initialize()
  })

  afterAll(async () => {
    await testSetup.quit()
  })

  test('Deve carregar a página de login', async () => {
    const driver = testSetup.driver!
    await testSetup.navigateTo('/')

    // Aguardar o título da página
    await driver.wait(until.titleContains('PróSiga'), 5000)
    
    const title = await driver.getTitle()
    expect(title).toContain('PróSiga')
    
    // Pausa para visualizar
    await driver.sleep(2000)
  })

  test('Deve exibir mensagem de erro com credenciais inválidas', async () => {
    const driver = testSetup.driver!
    await testSetup.navigateTo('/')
    await driver.sleep(2000)

    // Preencher formulário com credenciais inválidas
    const emailInput = await driver.wait(
      until.elementLocated(By.css('input#email')),
      5000
    )
    await emailInput.click()
    await driver.sleep(300)
    await emailInput.clear()
    await driver.sleep(300)
    await emailInput.sendKeys('usuario@invalido.com')
    await driver.sleep(1000)

    const passwordInput = await driver.findElement(By.css('input#password'))
    await passwordInput.click()
    await driver.sleep(300)
    await passwordInput.clear()
    await driver.sleep(300)
    await passwordInput.sendKeys('senhaerrada')
    await driver.sleep(1000)

    // Clicar no botão de login
    const submitButton = await driver.findElement(By.css('button[type="submit"]'))
    await submitButton.click()

    // Aguardar mensagem de erro aparecer
    await driver.sleep(3000)
    
    // Procurar pela div de erro (classe text-red-600)
    const errorMessage = await driver.wait(
      until.elementLocated(By.css('.text-red-600')),
      10000
    )
    const errorText = await errorMessage.getText()
    console.log('Mensagem de erro capturada:', errorText)
    expect(errorText).toContain('incorretos')
    
    await driver.sleep(2000)
  })

  test('Deve fazer login com credenciais válidas', async () => {
    const driver = testSetup.driver!
    await testSetup.navigateTo('/')
    await driver.sleep(2000)

    const email = 'bruno@email.com'
    const password = 'teste-bruno'

    // Encontrar e clicar no campo de email primeiro
    const emailInput = await driver.wait(
      until.elementLocated(By.css('input#email')),
      5000
    )
    await emailInput.click()
    await driver.sleep(300)
    await emailInput.clear()
    await driver.sleep(300)
    
    // Digitar o email
    await emailInput.sendKeys(email)
    await driver.sleep(1000)

    // Encontrar e clicar no campo de senha
    const passwordInput = await driver.findElement(By.css('input#password'))
    await passwordInput.click()
    await driver.sleep(300)
    await passwordInput.clear()
    await driver.sleep(300)
    
    // Digitar a senha
    await passwordInput.sendKeys(password)
    await driver.sleep(1000)

    // Clicar no botão de submit
    const submitButton = await driver.findElement(By.css('button[type="submit"]'))
    await submitButton.click()

    // Aguardar redirecionamento ou mensagem de erro
    await driver.sleep(5000)
    
    // Verificar se houve erro
    try {
      const errorDiv = await driver.findElement(By.css('.text-red-600'))
      const errorText = await errorDiv.getText()
      console.log('ERRO:', errorText)
      await driver.sleep(5000)
      
      // Falhar o teste mostrando o erro
      throw new Error(`Login falhou com erro: ${errorText}`)
    } catch (e: any) {
      // Se não encontrou erro, verificar se foi redirecionado
      if (!e.message.includes('no such element')) {
        throw e // Re-lançar se for outro tipo de erro
      }
      
      const currentUrl = await driver.getCurrentUrl()
      console.log('URL após login:', currentUrl)
      expect(currentUrl).toContain('/dashboard')
      
      // Pausa para visualizar o dashboard
      await driver.sleep(3000)
    }
  })
})
