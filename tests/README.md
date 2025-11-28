# Selenium E2E Tests - ProSiga

## Estrutura dos Testes

```
tests/
├── setup.ts              # Configuração do Selenium WebDriver
└── e2e/
    ├── login.test.ts     # Testes de autenticação
    └── navigation.test.ts # Testes de navegação
```

## Como Usar

### 1. Executar os testes

**Rodar todos os testes:**
```bash
npm test
```

**Rodar apenas testes E2E:**
```bash
npm run test:e2e
```

**Rodar em modo watch:**
```bash
npm run test:watch
```

### 2. Antes de executar os testes

**Certifique-se de que o servidor está rodando:**
```bash
npm run dev
```

Os testes usam por padrão `http://localhost:3000`. Se estiver usando outra porta ou URL, ajuste no `TestSetup`.

### 3. Executar com servidor em produção

Para testar contra o servidor de produção, modifique o `TestSetup`:

```typescript
testSetup = new TestSetup('https://prosiga-frontend.vercel.app')
```

## Configuração do Selenium

O arquivo `tests/setup.ts` configura o Chrome em modo headless (sem interface). Para ver o navegador durante os testes, remova a linha:

```typescript
options.addArguments('--headless')
```

## Exemplos de Testes

### Teste de Login
- Carrega a página de login
- Testa credenciais inválidas
- Testa login com sucesso

### Teste de Navegação
- Verifica página inicial
- Verifica presença do widget VLibras

## Criando Novos Testes

```typescript
import { By, until } from 'selenium-webdriver'
import { TestSetup } from '../setup'

describe('Meu Teste', () => {
  let testSetup: TestSetup

  beforeAll(async () => {
    testSetup = new TestSetup()
    await testSetup.initialize()
  })

  afterAll(async () => {
    await testSetup.quit()
  })

  test('Deve fazer algo', async () => {
    const driver = testSetup.driver!
    await testSetup.navigateTo('/pagina')
    
    // Seu teste aqui
    const element = await driver.findElement(By.css('.seletor'))
    expect(element).toBeTruthy()
  })
})
```

## Seletores Úteis

- `By.id('elementId')` - Por ID
- `By.css('.class')` - Por classe CSS
- `By.css('input[type="email"]')` - Por atributo
- `By.xpath('//div[@class="teste"]')` - Por XPath

## Timeouts

O timeout padrão é 30 segundos (configurado no `jest.config.js`). Para testes mais longos:

```typescript
test('Teste longo', async () => {
  // seu teste
}, 60000) // 60 segundos
```
