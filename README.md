# Verzel Store · Teste técnico de QA

Validação da entrega **VZS-142 · Cupom de desconto e frete grátis** (versão 2.3.0) da Verzel Store, feita como no dia a dia de um time de desenvolvimento: levantamento de cenários a partir da documentação, execução manual e exploratória, report de bugs, evidências e automação com Playwright.

| Recurso                 | Endereço                                                           |
|-------------------------|--------------------------------------------------------------------|
| Loja                    | https://verzel-store.qa-test-verzel-store.workers.dev              |
| Documentação da entrega | https://verzel-store.qa-test-verzel-store.workers.dev/documentacao |
| API                     | https://verzel-store.qa-test-verzel-store.workers.dev/api          |

---

## Sumário

1. [Resultado em números](#1-resultado-em-números)
2. [Onde encontrar cada entrega](#2-onde-encontrar-cada-entrega)
3. [Estrutura do repositório](#3-estrutura-do-repositório)
4. [Como executar a automação](#4-como-executar-a-automação)
5. [Testes automatizados](#5-testes-automatizados)
6. [Arquitetura da automação](#6-arquitetura-da-automação)
7. [Testes manuais](#7-testes-manuais)
8. [Testes exploratórios](#8-testes-exploratórios)
9. [Bugs encontrados](#9-bugs-encontrados)
10. [Interpretações e ambiguidades](#10-interpretações-e-ambiguidades)
11. [Convenções usadas](#11-convenções-usadas)
12. [Ferramentas e ambiente](#12-ferramentas-e-ambiente)

---

## 1. Resultado em números

| Tipo de teste          | Cenários | ✅ Passou | ❌ Falhou | ⚠️ Observação |
|------------------------|----------|-----------|-----------|---------------|
| Manual · Interface     | 29       | 28        | 1         | 0             |
| Manual · API           | 29       | 25        | 4         | 0             |
| Exploratório           | 17       | 15        | 1         | 1             |
| Automação (Playwright) | 15       | 13        | 2         | 0             |

- Na automação, os 2 ❌ são os testes que **reproduzem os bugs**. Eles são marcados para falhar enquanto o bug existir, por isso o Playwright exibe "15 passed" (veja a [seção 4.3](#43-resultado-esperado)).
- **2 bugs encontrados**, ambos confirmados na execução manual e na automação: [BUG-01](docs/bugs/BUG-01.md) e [BUG-02](docs/bugs/BUG-02.md).
- **Cobertura:** os 11 critérios de aceite (CA01 a CA11), os 4 endpoints da API e os 13 códigos de erro da documentação foram testados. A matriz completa está em [`docs/resultados.md`](docs/resultados.md#cobertura-da-documentação).

---

## 2. Onde encontrar cada entrega

| Item pedido no teste técnico                                                 | Onde está                                                                                                                                                             |
|------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Cenários de teste levantados a partir da documentação (Gherkin)              | [`docs/cenarios/ui`](docs/cenarios/ui) (29 cenários de interface) e [`docs/cenarios/api`](docs/cenarios/api) (29 cenários de API), todos em **Gherkin**, em português |
| Execução dos testes manuais e exploratórios, com o resultado de cada cenário | [`docs/resultados.md`](docs/resultados.md) (manuais e automação) e [`docs/exploratorio/sessoes.md`](docs/exploratorio/sessoes.md) (exploratórios)                     |
| Report de todos os bugs encontrados                                          | [`docs/bugs`](docs/bugs)                                                                                                                                              |
| Documento com as evidências da execução                                      | [`docs/resultados.md`](docs/resultados.md), que liga cada cenário à sua pasta de evidências em [`docs/evidencias`](docs/evidencias)                                   |
| Automação de pelo menos 3 cenários com Playwright                            | [`automacao`](automacao): **15 testes** (10 de interface e 5 de API)                                                                                                  |
| README explicando como rodar a automação e onde encontrar cada entrega       | Este arquivo                                                                                                                                                          |

---

## 3. Estrutura do repositório

```
verzel-store-qa/
├── automacao/                     Automação com Playwright + TypeScript
│   ├── tests/
│   │   ├── e2e/                   10 testes de interface (cupom, frete, quantidade, checkout)
│   │   └── api/                   5 testes de API (carrinho e pedidos)
│   ├── pages/                     Page Objects (uma classe por tela)
│   │   └── components/            Componente "Resumo do pedido", usado em 3 telas
│   ├── api/                       Cliente da API, builder do carrinho e tipos das respostas
│   ├── data/                      Massa de dados da documentação e catálogo de bugs
│   ├── fixtures/                  Fixtures do Playwright e matcher customizado
│   └── utils/                     Formatação de moeda (R$)
│
├── docs/
│   ├── cenarios/
│   │   ├── ui/                    Cenários manuais de interface em Gherkin (CTM-01 a CTM-29)
│   │   └── api/                   Cenários manuais de API em Gherkin (CTA-01 a CTA-29)
│   ├── exploratorio/
│   │   └── sessoes.md             Sessões exploratórias com o resultado de cada teste (EXP-01 a EXP-17)
│   ├── evidencias/
│   │   ├── manual-ui/             Prints da execução manual de interface (uma pasta por cenário)
│   │   ├── manual-api/            Prints do Postman (uma pasta por cenário)
│   │   ├── exploratorio/          Gravações em GIF (uma pasta por teste)
│   │   └── automacao/             Relatório do Playwright e log da execução
│   ├── bugs/                      Reports do BUG-01 e do BUG-02
│   ├── postman/                   Coleção do Postman com as 32 requisições dos testes de API
│   ├── resultados.md              Resultado de todos os cenários, links das evidências e matriz de cobertura
│   └── documentacao-referencia.md Cópia da documentação da entrega usada como base
│
├── playwright.config.ts           Configuração do Playwright
├── tsconfig.json                  Configuração do TypeScript
└── package.json                   Dependências e scripts
```

---

## 4. Como executar a automação

### 4.1 Pré-requisitos

| Ferramenta                    | Versão                        | Como verificar  |
|-------------------------------|-------------------------------|-----------------|
| [Node.js](https://nodejs.org) | 18 ou superior (usado: 20.18) | `node -v`       |
| npm                           | Vem com o Node.js             | `npm -v`        |
| [Git](https://git-scm.com)    | Qualquer versão recente       | `git --version` |

Não é preciso instalar navegador: o Playwright baixa o Chromium no passo 3.

### 4.2 Passo a passo

**1. Clonar o repositório**
```bash
git clone https://github.com/brunavaladares/verzel-store-qa.git
cd verzel-store-qa
```

**2. Instalar o Playwright e as demais dependências**
```bash
npm install
```
Este comando baixa o **Playwright** (`@playwright/test`) e o TypeScript, nas versões definidas no `package.json` e no `package-lock.json`. Não é preciso instalar o Playwright separadamente.

**3. Baixar o navegador usado pelos testes**
```bash
npx playwright install chromium
```
O Playwright usa um Chromium próprio, baixado uma única vez (cerca de 150 MB).
> No Linux, se faltar alguma biblioteca do sistema, use `npx playwright install --with-deps chromium`.

**4. Rodar todos os testes**
```bash
npm test
```

**5. Abrir o relatório HTML**
```bash
npm run report
```
O relatório da última execução abre no navegador com cada teste, suas etapas (Dado, Quando, Então), as tags e, nos testes de bug, a anotação BUG-01 ou BUG-02. Ele só existe depois de rodar o passo 4. Para encerrar, use `Ctrl+C` no terminal.

### 4.3 Resultado esperado

```
Running 15 tests using 2 workers

  ok  1 [api] › ... › CT-11 · desconto não incide sobre o frete e os valores são arredondados em 2 casas
  x   2 [api] › ... › CT-12 · API recusa mais de 5 unidades do mesmo produto      ← BUG-02 reproduzido
  ...
  x  13 [e2e] › ... › CT-06 · subtotal de exatamente R$ 200,00 tem frete grátis    ← BUG-01 reproduzido

  15 passed (≈ 20s)
```

**Por que aparece `x` e mesmo assim "15 passed"?** Os testes CT-06 e CT-12 reproduzem bugs reais e foram declarados com `test.fail()`. Para o Playwright, eles **devem falhar** enquanto o bug existir, e isso conta como aprovado. Quando o time corrigir o bug, o teste passa a dar erro, avisando que a marcação `test.fail()` deve ser removida. Assim a suíte fica verde sem esconder os bugs.

Se aparecer `failed`, algum comportamento da loja mudou. O Playwright guarda screenshot, vídeo e trace da falha em `test-results/`.

### 4.4 Todos os comandos disponíveis

| Comando             | O que faz                                                                                                          |
|---------------------|--------------------------------------------------------------------------------------------------------------------|
| `npm test`          | Roda os 15 testes                                                                                                  |
| `npm run test:e2e`  | Roda só os 10 testes de interface                                                                                  |
| `npm run test:api`  | Roda só os 5 testes de API                                                                                         |
| `npm run test:bugs` | Roda só os 2 testes que reproduzem bugs                                                                            |
| `npm run test:ui`   | Abre o **modo interativo** do Playwright: lista de testes, execução passo a passo e linha do tempo com screenshots |
| `npm run report`    | Abre o relatório HTML da última execução                                                                           |
| `npm run typecheck` | Verifica os tipos do TypeScript                                                                                    |

### 4.5 Outras formas úteis de executar

| Comando                                                    | O que faz                                                                        |
|------------------------------------------------------------|----------------------------------------------------------------------------------|
| `npx playwright test --grep CT-09`                         | Roda um teste específico pelo ID                                                 |
| `npx playwright test --grep @CA06`                         | Roda todos os testes de um critério de aceite                                    |
| `npx playwright test --grep @cupom`                        | Roda todos os testes de um tema (`@cupom`, `@frete`, `@checkout`, `@quantidade`) |
| `npx playwright test --project=e2e --headed`               | Roda a interface com o navegador **visível**                                     |
| `npx playwright test --grep CT-09 --debug`                 | Abre o inspetor e executa passo a passo                                          |
| `npx playwright show-trace test-results/<pasta>/trace.zip` | Abre o trace de um teste que falhou                                              |

---

## 5. Testes automatizados

Os 15 testes cobrem os fluxos principais da entrega. Cada um tem tags com o critério de aceite (`@CA01` a `@CA11`) e o tema.

| ID    | Teste                                                                      | Arquivo                                                            | Critério   |
|-------|----------------------------------------------------------------------------|--------------------------------------------------------------------|------------|
| CT-01 | Cupom digitado em minúsculas e com espaços aplica 10% de desconto          | [`e2e/cupom.spec.ts`](automacao/tests/e2e/cupom.spec.ts)           | CA01, CA02 |
| CT-02 | Cupom inexistente mostra "Cupom inválido." e não dá desconto               | [`e2e/cupom.spec.ts`](automacao/tests/e2e/cupom.spec.ts)           | CA03       |
| CT-03 | Cupom expirado mostra "Cupom expirado." e não dá desconto                  | [`e2e/cupom.spec.ts`](automacao/tests/e2e/cupom.spec.ts)           | CA04       |
| CT-04 | Só um cupom por vez: é preciso remover o atual para trocar                 | [`e2e/cupom.spec.ts`](automacao/tests/e2e/cupom.spec.ts)           | CA05       |
| CT-05 | Abaixo de R$ 200,00 cobra R$ 19,90 e informa quanto falta                  | [`e2e/frete.spec.ts`](automacao/tests/e2e/frete.spec.ts)           | CA07       |
| CT-06 | Subtotal de exatamente R$ 200,00 tem frete grátis · **reproduz o BUG-01**  | [`e2e/frete.spec.ts`](automacao/tests/e2e/frete.spec.ts)           | CA06       |
| CT-07 | Frete segue grátis quando o cupom deixa o total abaixo de R$ 200,00        | [`e2e/frete.spec.ts`](automacao/tests/e2e/frete.spec.ts)           | CA06, CA08 |
| CT-08 | Vitrine e carrinho bloqueiam a 6ª unidade do mesmo produto                 | [`e2e/quantidade.spec.ts`](automacao/tests/e2e/quantidade.spec.ts) | CA10       |
| CT-09 | Compra completa com cupom gera pedido com os mesmos valores do carrinho    | [`e2e/checkout.spec.ts`](automacao/tests/e2e/checkout.spec.ts)     | CA01       |
| CT-10 | Dados inválidos mostram o erro de cada campo e não enviam o pedido         | [`e2e/checkout.spec.ts`](automacao/tests/e2e/checkout.spec.ts)     | —          |
| CT-11 | Desconto não incide sobre o frete e os valores são arredondados em 2 casas | [`api/carrinho.spec.ts`](automacao/tests/api/carrinho.spec.ts)     | CA09, CA11 |
| CT-12 | API recusa mais de 5 unidades do mesmo produto · **reproduz o BUG-02**     | [`api/carrinho.spec.ts`](automacao/tests/api/carrinho.spec.ts)     | CA10       |
| CT-13 | Itens inválidos retornam o código de erro da documentação                  | [`api/carrinho.spec.ts`](automacao/tests/api/carrinho.spec.ts)     | —          |
| CT-14 | Pedido confirmado tem os mesmos valores do cálculo do carrinho             | [`api/pedidos.spec.ts`](automacao/tests/api/pedidos.spec.ts)       | CA01       |
| CT-15 | Cupom inválido ou expirado é aviso no carrinho, mas bloqueia o pedido      | [`api/pedidos.spec.ts`](automacao/tests/api/pedidos.spec.ts)       | CA03, CA04 |

Evidência da última execução: [`docs/evidencias/automacao`](docs/evidencias/automacao).

---

## 6. Arquitetura da automação

| Camada         | Pasta                | Responsabilidade                                                                                                                  |
|----------------|----------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| Testes         | `automacao/tests`    | Só os cenários. Usam `test.step` com **Dado / Quando / Então**, que aparecem no relatório                                         |
| Page Objects   | `automacao/pages`    | Uma classe por tela (vitrine, carrinho, checkout, confirmação). Concentram os seletores, sempre por papel acessível (`getByRole`) |
| Cliente da API | `automacao/api`      | `VerzelApi` (requisições), `Carrinho` (builder do corpo) e tipos das respostas                                                    |
| Fixtures       | `automacao/fixtures` | Entregam as páginas e a API prontas para cada teste e o `expect` customizado                                                      |
| Dados          | `automacao/data`     | Produtos, cupons e mensagens da documentação, e o catálogo de bugs                                                                |

**Destaques:**
- **Builder legível para a API:**
  ```ts
  await api.calcularResumo(Carrinho.com(CALCA).e(BONE, 2).comCupom('BEMVINDO10'));
  ```
- **Matcher customizado para erros da API**, que valida status, código, campo e o formato `{ erro: {...} }` em uma linha:
  ```ts
  await expect(resposta).toBeErroDaApi({ status: 422, codigo: 'CUPOM_EXPIRADO', campo: 'cupom' });
  ```
- **Bugs marcados com `test.fail()`** e anotação do bug, como explicado na [seção 4.3](#43-resultado-esperado).
- **TypeScript estrito** (`npm run typecheck`), sem bibliotecas além do Playwright e do próprio TypeScript.

---

## 7. Testes manuais

### Interface (CTM-01 a CTM-29)
- **Cenários:** [`docs/cenarios/ui`](docs/cenarios/ui), em 4 arquivos (cupom, frete, quantidade e checkout).
- **Execução:** manual no Microsoft Edge, com o DevTools aberto para capturar a resposta da API quando um cenário falhava.
- **Evidências:** [`docs/evidencias/manual-ui`](docs/evidencias/manual-ui), uma pasta por cenário, com prints numerados na ordem dos passos.

### API (CTA-01 a CTA-29)
- **Cenários:** [`docs/cenarios/api`](docs/cenarios/api), em 6 arquivos (produtos, cupom, frete e cálculo, quantidade, códigos de erro e pedidos).
- **Execução:** manual no Postman.
- **Evidências:** [`docs/evidencias/manual-api`](docs/evidencias/manual-api), com a requisição e a resposta de cada cenário.

**Para repetir os testes de API:** no Postman, clique em **Import** e selecione [`docs/postman/verzel-store-api.postman_collection.json`](docs/postman/verzel-store-api.postman_collection.json). A coleção tem as 32 requisições organizadas em 6 pastas, já com URL, corpo e headers. Cada requisição tem o ID do cenário no nome, por exemplo "CTA-10 · Subtotal exatamente 200.00 (BUG-01)".

O resultado de cada cenário manual está em [`docs/resultados.md`](docs/resultados.md).

---

## 8. Testes exploratórios

Executados no formato de **sessões com missão e tempo definidos** (*Session-Based Testing*). Exploratório não segue um roteiro fixo, por isso não foi escrito em Gherkin.

| Sessão                     | Testes          | Foco                                                                             |
|----------------------------|-----------------|----------------------------------------------------------------------------------|
| 1 · Carrinho e navegação   | EXP-01 a EXP-04 | Recarregar a página, nova aba, botão Voltar e duplo clique em "Confirmar pedido" |
| 2 · Cupom                  | EXP-05 a EXP-09 | Esvaziar o carrinho com cupom, Enter, só espaços e caracteres especiais          |
| 3 · Checkout               | EXP-10 a EXP-12 | Nomes com acentos e espaços, CEP com espaço                                      |
| 4 · Consistência e celular | EXP-13 e EXP-14 | Limite entre vitrine e carrinho, compra no celular                               |
| 5 · API                    | EXP-15 a EXP-17 | Campos extras, quantidade de 1.000.000, cupom numérico                           |

- **Resultados:** [`docs/exploratorio/sessoes.md`](docs/exploratorio/sessoes.md): 15 ✅, 1 ⚠️ e 1 ❌ (EXP-16, mesma causa do BUG-02).
- **Evidências:** [`docs/evidencias/exploratorio`](docs/evidencias/exploratorio), com gravações em GIF.

---

## 9. Bugs encontrados

| ID                            | Título                                                   | Critério | Severidade | Prioridade | Evidências                    |
|-------------------------------|----------------------------------------------------------|----------|------------|------------|-------------------------------|
| [BUG-01](docs/bugs/BUG-01.md) | Subtotal de exatamente R$ 200,00 não recebe frete grátis | CA06     | Alta       | Alta       | CTM-13, CTA-10, CTA-28, CT-06 |
| [BUG-02](docs/bugs/BUG-02.md) | API aceita mais de 5 unidades do mesmo produto           | CA10     | Alta       | Média      | CTA-15, CTA-29, EXP-16, CT-12 |

**BUG-01:** a loja cobra R$ 19,90 de frete quando o subtotal é exatamente R$ 200,00 e, ao mesmo tempo, informa "Faltam R$ 0,00 para o frete grátis". R$ 199,90 e R$ 229,90 funcionam; só o valor exato da fronteira falha.

**BUG-02:** a interface bloqueia a 6ª unidade, mas a API aceita qualquer quantidade (inclusive 1.000.000) e confirma o pedido com status 201. O erro `QUANTIDADE_MAXIMA_EXCEDIDA` da documentação nunca é retornado.

Cada report traz ambiente, pré-condições, passos para reproduzir, esperado e obtido com o JSON da resposta, impacto, causa provável e evidências.

---

## 10. Interpretações e ambiguidades

O teste técnico pede que as ambiguidades da documentação sejam registradas com a interpretação adotada:

| Situação                                               | Interpretação                                                                                                                                                                                                       |
|--------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Aplicar cupom com o campo vazio (CTM-05)               | A documentação não define. Considerado correto não aplicar desconto e orientar o cliente; a loja exibe "Informe um cupom.".                                                                                         |
| CEP com espaço no lugar do hífen, `01310 100` (EXP-12) | A regra cita apenas "com ou sem hífen". A recusa foi registrada como observação (⚠️), não como bug.                                                                                                                 |
| CA05 (apenas um cupom por vez) na API                  | A API recebe um único campo `cupom`, então a regra só se aplica à interface. Testado no CTM-08 e no CT-04.                                                                                                          |
| CA11 (arredondamento)                                  | Como os preços terminam em ,90 ou ,00, 10% de desconto sempre dá 2 casas. O teste usa um carrinho de R$ 219,80, cuja conta gera resíduo de ponto flutuante (`21.980000000000004`), para provar que a API arredonda. |
| Prioridade do BUG-02                                   | Média, porque a interface protege o cliente comum. A severidade é Alta, porque a API confirma pedidos fora da regra.                                                                                                |
| Itens de "Sobre este ambiente"                         | Carrinho só na aba, pedidos não armazenados e número fictício não foram tratados como bug. O comportamento do carrinho foi confirmado nos testes EXP-01 a EXP-03.                                                   |

---

## 11. Convenções usadas

| Prefixo    | Significado                          | Onde                           |
|------------|--------------------------------------|--------------------------------|
| **CTM-xx** | Cenário de teste manual de interface | `docs/cenarios/ui`             |
| **CTA-xx** | Cenário de teste manual de API       | `docs/cenarios/api`            |
| **EXP-xx** | Teste exploratório                   | `docs/exploratorio/sessoes.md` |
| **CT-xx**  | Teste automatizado                   | `automacao/tests`              |
| **BUG-xx** | Bug encontrado                       | `docs/bugs`                    |

| Tag (Gherkin e Playwright)                      | Significado                                 |
|-------------------------------------------------|---------------------------------------------|
| `@CA01` a `@CA11`                               | Critério de aceite verificado               |
| `@bug @BUG-01`                                  | Cenário que reproduz um bug                 |
| `@automatizado-CT-xx`                           | Cenário manual que também está automatizado |
| `@cupom`, `@frete`, `@quantidade`, `@checkout`… | Tema do cenário                             |

**Evidências:** cada cenário tem a sua pasta (`CTM-13_frete-exatamente-200/`) com arquivos numerados na ordem dos passos (`01_frete-cobrado-tela_BUG-01.png`). Arquivos com sufixo `_BUG-01` ou `_BUG-02` são a prova do bug.

**Legenda:** ✅ passou · ❌ falhou · ⚠️ observação ou ambiguidade

---

## 12. Ferramentas e ambiente

| Ferramenta                   | Uso                                         |
|------------------------------|---------------------------------------------|
| Playwright 1.63 + TypeScript | Automação de interface e de API             |
| Microsoft Edge + DevTools    | Execução manual e exploratória de interface |
| Postman                      | Execução manual e exploratória de API       |
| Gherkin (português)          | Escrita dos cenários                        |
| Windows 11 · Node.js 20.18   | Ambiente de execução                        |
