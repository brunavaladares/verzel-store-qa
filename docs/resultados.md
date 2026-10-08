# Resultados da execução

Entrega **VZS-142 · Cupom de desconto e frete grátis** (v2.3.0) · https://verzel-store.qa-test-verzel-store.workers.dev
Execução manual no Microsoft Edge e no Postman · Execução automatizada com Playwright

**Legenda:** ✅ passou · ❌ falhou · ⚠️ observação

## Resumo

| Tipo                                     | Cenários | ✅  | ❌  | ⚠️  | Bugs           |
|------------------------------------------|----------|-----|-----|-----|----------------|
| [Manual · Interface](#manual--interface) | 29       | 28  | 1   | 0   | BUG-01         |
| [Manual · API](#manual--api)             | 29       | 25  | 4   | 0   | BUG-01, BUG-02 |
| [Exploratório](#exploratório)            | 17       | 15  | 1   | 1   | BUG-02         |
| [Automação](#automação)                  | 15       | 13  | 2   | 0   | BUG-01, BUG-02 |

Bugs encontrados: [BUG-01](bugs/BUG-01.md) (frete cobrado com subtotal de exatamente R$ 200,00) e [BUG-02](bugs/BUG-02.md) (API aceita mais de 5 unidades).

## Cobertura da documentação

Cada item da [documentação da entrega](documentacao-referencia.md) e os cenários que o verificam. Cenários com ❌ falharam.

| Requisito                                            | Manual · Interface    | Manual · API                    | Exploratório   | Automação    |
|------------------------------------------------------|-----------------------|---------------------------------|----------------|--------------|
| CA01 · BEMVINDO10 dá 10% sobre o subtotal            | CTM-01, 09, 23        | CTA-04, 24                      | —              | CT-01, 09    |
| CA02 · Maiúsculas, minúsculas e espaços ignorados    | CTM-02, 03, 07        | CTA-05                          | EXP-08         | CT-01        |
| CA03 · Cupom inexistente: "Cupom inválido."          | CTM-04, 05            | CTA-06, 26                      | EXP-09, 17     | CT-02, 15    |
| CA04 · Cupom expirado: "Cupom expirado."             | CTM-06, 07            | CTA-07, 25                      | —              | CT-03, 15    |
| CA05 · Apenas um cupom por vez                       | CTM-08                | — (regra da interface)          | EXP-05         | CT-04        |
| CA06 · Frete grátis a partir de R$ 200,00, inclusive | CTM-13 ❌, 14, 15, 24 | CTA-10 ❌, 11, 28 ❌            | —              | CT-06 ❌, 07 |
| CA07 · Abaixo de R$ 200,00: R$ 19,90 e quanto falta  | CTM-11, 12, 15        | CTA-09                          | EXP-06         | CT-05        |
| CA08 · Frete grátis usa o subtotal antes do desconto | CTM-16, 17            | CTA-11                          | —              | CT-07        |
| CA09 · Desconto não incide sobre o frete             | CTM-18                | CTA-12                          | —              | CT-11        |
| CA10 · Máximo de 5 unidades (interface e API)        | CTM-19, 20, 21        | CTA-14, 15 ❌, 29 ❌            | EXP-13, 16 ❌  | CT-08, 12 ❌ |
| CA11 · Valores com 2 casas decimais                  | CTM-10                | CTA-13                          | —              | CT-11        |
| Regras de cálculo (fórmula do total)                 | CTM-09, 10            | CTA-04, 13                      | EXP-15         | CT-11, 14    |
| Nome, e-mail e CEP do cliente                        | CTM-25 a 29           | CTA-27                          | EXP-10, 11, 12 | CT-10        |
| Pagamento na entrega                                 | CTM-23                | —                               | —              | —            |
| Dados para teste (produtos e preços)                 | —                     | CTA-01, 02                      | —              | —            |
| Endpoints da API (4)                                 | —                     | CTA-01 a 29                     | EXP-15 a 17    | CT-11 a 15   |
| Códigos de erro (13 de 13)                           | —                     | CTA-03, 15 ❌, 16 a 23, 25 a 27 | —              | CT-13, 15    |
| Sobre este ambiente (carrinho por aba)               | —                     | —                               | EXP-01, 02, 03 | —            |

---

## Manual · Interface

Cenários em Gherkin: [`cenarios/ui`](cenarios/ui) · Evidências: [`evidencias/manual-ui`](evidencias/manual-ui)

| ID     | Cenário                                           | CA         | Resultado                   | Evidência                                                          |
|--------|---------------------------------------------------|------------|-----------------------------|--------------------------------------------------------------------|
| CTM-01 | Cupom BEMVINDO10 aplica 10%                       | CA01       | ✅                          | [prints](evidencias/manual-ui/CTM-01_cupom-bemvindo10)             |
| CTM-02 | Cupom em minúsculas é aceito                      | CA02       | ✅                          | [prints](evidencias/manual-ui/CTM-02_cupom-minusculas)             |
| CTM-03 | Espaços no início e no fim são ignorados          | CA02       | ✅                          | [prints](evidencias/manual-ui/CTM-03_cupom-com-espacos)            |
| CTM-04 | Cupom inexistente: "Cupom inválido."              | CA03       | ✅                          | [prints](evidencias/manual-ui/CTM-04_cupom-inexistente)            |
| CTM-05 | Cupom com o campo vazio: "Informe um cupom."      | CA03       | ✅                          | [prints](evidencias/manual-ui/CTM-05_cupom-vazio)                  |
| CTM-06 | Cupom expirado: "Cupom expirado."                 | CA04       | ✅                          | [prints](evidencias/manual-ui/CTM-06_cupom-expirado)               |
| CTM-07 | Cupom expirado em minúsculas                      | CA02, CA04 | ✅                          | [prints](evidencias/manual-ui/CTM-07_cupom-expirado-minusculas)    |
| CTM-08 | Apenas um cupom por vez                           | CA05       | ✅                          | [prints](evidencias/manual-ui/CTM-08_um-cupom-por-vez)             |
| CTM-09 | Desconto recalculado ao mudar a quantidade        | CA01       | ✅                          | [prints](evidencias/manual-ui/CTM-09_desconto-ao-mudar-quantidade) |
| CTM-10 | Valores com 2 casas decimais                      | CA11       | ✅                          | [prints](evidencias/manual-ui/CTM-10_duas-casas-decimais)          |
| CTM-11 | Abaixo de R$ 200: frete e quanto falta            | CA07       | ✅                          | [prints](evidencias/manual-ui/CTM-11_frete-abaixo-de-200)          |
| CTM-12 | Valor-limite: R$ 199,90 paga frete                | CA07       | ✅                          | [prints](evidencias/manual-ui/CTM-12_frete-199-90)                 |
| CTM-13 | Valor-limite: exatamente R$ 200,00                | CA06       | ❌ [BUG-01](bugs/BUG-01.md) | [prints](evidencias/manual-ui/CTM-13_frete-exatamente-200)         |
| CTM-14 | Acima de R$ 200: frete grátis                     | CA06       | ✅                          | [prints](evidencias/manual-ui/CTM-14_frete-acima-de-200)           |
| CTM-15 | Frete atualiza ao adicionar e remover             | CA06, CA07 | ✅                          | [prints](evidencias/manual-ui/CTM-15_frete-ao-adicionar-e-remover) |
| CTM-16 | Frete grátis mantido após o cupom                 | CA08       | ✅                          | [prints](evidencias/manual-ui/CTM-16_frete-gratis-com-cupom)       |
| CTM-17 | Cupom não altera quanto falta para o frete grátis | CA08       | ✅                          | [prints](evidencias/manual-ui/CTM-17_cupom-nao-altera-faltante)    |
| CTM-18 | Desconto não incide sobre o frete                 | CA09       | ✅                          | [prints](evidencias/manual-ui/CTM-18_desconto-nao-incide-no-frete) |
| CTM-19 | Vitrine bloqueia em 5 unidades                    | CA10       | ✅                          | [prints](evidencias/manual-ui/CTM-19_limite-5-na-vitrine)          |
| CTM-20 | Carrinho bloqueia o "+" em 5 unidades             | CA10       | ✅                          | [prints](evidencias/manual-ui/CTM-20_limite-5-no-carrinho)         |
| CTM-21 | "−" libera o "+" e para em 1                      | CA10       | ✅                          | [prints](evidencias/manual-ui/CTM-21_diminuir-quantidade)          |
| CTM-22 | Remover item e esvaziar o carrinho                | —          | ✅                          | [prints](evidencias/manual-ui/CTM-22_remover-e-esvaziar)           |
| CTM-23 | Compra completa com cupom                         | CA01       | ✅                          | [prints](evidencias/manual-ui/CTM-23_compra-com-cupom)             |
| CTM-24 | Compra sem cupom com frete grátis                 | CA06       | ✅                          | [prints](evidencias/manual-ui/CTM-24_compra-com-frete-gratis)      |
| CTM-25 | Campos obrigatórios vazios                        | —          | ✅                          | [prints](evidencias/manual-ui/CTM-25_campos-vazios)                |
| CTM-26 | Nome sem sobrenome é recusado                     | —          | ✅                          | [prints](evidencias/manual-ui/CTM-26_nome-sem-sobrenome)           |
| CTM-27 | E-mail inválido é recusado                        | —          | ✅                          | [prints](evidencias/manual-ui/CTM-27_email-invalido)               |
| CTM-28 | CEP sem 8 dígitos é recusado                      | —          | ✅                          | [prints](evidencias/manual-ui/CTM-28_cep-invalido)                 |
| CTM-29 | CEP com e sem hífen é aceito                      | —          | ✅                          | [prints](evidencias/manual-ui/CTM-29_cep-valido)                   |

## Manual · API

Cenários em Gherkin: [`cenarios/api`](cenarios/api) · Evidências: [`evidencias/manual-api`](evidencias/manual-api) · Coleção do Postman: [`postman`](postman)

| ID     | Cenário                                                      | CA         | Resultado                   | Evidência                                                           |
|--------|--------------------------------------------------------------|------------|-----------------------------|---------------------------------------------------------------------|
| CTA-01 | Listagem traz os 8 produtos da documentação                  | —          | ✅                          | [prints](evidencias/manual-api/CTA-01_listar-produtos)              |
| CTA-02 | Consulta de produto pelo id                                  | —          | ✅                          | [prints](evidencias/manual-api/CTA-02_consultar-produto)            |
| CTA-03 | Produto inexistente: 404                                     | —          | ✅                          | [prints](evidencias/manual-api/CTA-03_produto-inexistente)          |
| CTA-04 | BEMVINDO10 aplica 10% (exemplo da documentação)              | CA01       | ✅                          | [prints](evidencias/manual-api/CTA-04_cupom-bemvindo10)             |
| CTA-05 | Cupom em minúsculas e com espaços                            | CA02       | ✅                          | [prints](evidencias/manual-api/CTA-05_cupom-minusculas-e-espacos)   |
| CTA-06 | Cupom inexistente: 200 sem desconto                          | CA03       | ✅                          | [prints](evidencias/manual-api/CTA-06_cupom-inexistente)            |
| CTA-07 | Cupom expirado: 200 sem desconto                             | CA04       | ✅                          | [prints](evidencias/manual-api/CTA-07_cupom-expirado)               |
| CTA-08 | Sem cupom: `cupom` nulo                                      | —          | ✅                          | [prints](evidencias/manual-api/CTA-08_sem-cupom)                    |
| CTA-09 | Valor-limite: 199.90 paga frete                              | CA07       | ✅                          | [prints](evidencias/manual-api/CTA-09_frete-199-90)                 |
| CTA-10 | Valor-limite: exatamente 200.00                              | CA06       | ❌ [BUG-01](bugs/BUG-01.md) | [prints](evidencias/manual-api/CTA-10_frete-exatamente-200)         |
| CTA-11 | Frete grátis considera o subtotal antes do desconto          | CA06, CA08 | ✅                          | [prints](evidencias/manual-api/CTA-11_frete-gratis-com-cupom)       |
| CTA-12 | Desconto não incide sobre o frete                            | CA09       | ✅                          | [prints](evidencias/manual-api/CTA-12_desconto-nao-incide-no-frete) |
| CTA-13 | Valores com 2 casas decimais                                 | CA11       | ✅                          | [prints](evidencias/manual-api/CTA-13_duas-casas-decimais)          |
| CTA-14 | 5 unidades são aceitas                                       | CA10       | ✅                          | [prints](evidencias/manual-api/CTA-14_quantidade-5)                 |
| CTA-15 | 6 unidades são recusadas                                     | CA10       | ❌ [BUG-02](bugs/BUG-02.md) | [prints](evidencias/manual-api/CTA-15_quantidade-6)                 |
| CTA-16 | Lista de itens vazia: `ITENS_OBRIGATORIOS`                   | —          | ✅                          | [prints](evidencias/manual-api/CTA-16_itens-vazio)                  |
| CTA-17 | Item inválido: `ITEM_INVALIDO`                               | —          | ✅                          | [prints](evidencias/manual-api/CTA-17_item-invalido)                |
| CTA-18 | Produto inexistente no item: `PRODUTO_NAO_ENCONTRADO`        | —          | ✅                          | [prints](evidencias/manual-api/CTA-18_item-produto-inexistente)     |
| CTA-19 | Produto duplicado: `ITEM_DUPLICADO`                          | —          | ✅                          | [prints](evidencias/manual-api/CTA-19_item-duplicado)               |
| CTA-20 | Quantidade inválida (0, −1, 1.5, "2"): `QUANTIDADE_INVALIDA` | —          | ✅                          | [prints](evidencias/manual-api/CTA-20_quantidade-invalida)          |
| CTA-21 | JSON inválido: 400 `JSON_INVALIDO`                           | —          | ✅                          | [prints](evidencias/manual-api/CTA-21_json-invalido)                |
| CTA-22 | Rota inexistente: 404 `ROTA_NAO_ENCONTRADA`                  | —          | ✅                          | [prints](evidencias/manual-api/CTA-22_rota-inexistente)             |
| CTA-23 | Método não permitido: 405 `METODO_NAO_PERMITIDO`             | —          | ✅                          | [prints](evidencias/manual-api/CTA-23_metodo-nao-permitido)         |
| CTA-24 | Pedido válido com cupom: 201 e número VZ-000000              | CA01       | ✅                          | [prints](evidencias/manual-api/CTA-24_pedido-com-cupom)             |
| CTA-25 | Pedido com cupom expirado: 422 `CUPOM_EXPIRADO`              | CA04       | ✅                          | [prints](evidencias/manual-api/CTA-25_pedido-cupom-expirado)        |
| CTA-26 | Pedido com cupom inexistente: 422 `CUPOM_INVALIDO`           | CA03       | ✅                          | [prints](evidencias/manual-api/CTA-26_pedido-cupom-inexistente)     |
| CTA-27 | Pedido com dados inválidos: 422 `DADOS_INVALIDOS`            | —          | ✅                          | [prints](evidencias/manual-api/CTA-27_pedido-dados-invalidos)       |
| CTA-28 | Pedido de exatamente 200.00 tem frete grátis                 | CA06       | ❌ [BUG-01](bugs/BUG-01.md) | [prints](evidencias/manual-api/CTA-28_pedido-frete-200)             |
| CTA-29 | Pedido com 6 unidades é recusado                             | CA10       | ❌ [BUG-02](bugs/BUG-02.md) | [prints](evidencias/manual-api/CTA-29_pedido-quantidade-6)          |

## Exploratório

17 verificações em 5 sessões, com o resultado de cada uma em [`exploratorio/sessoes.md`](exploratorio/sessoes.md) · Evidências (GIFs): [`evidencias/exploratorio`](evidencias/exploratorio)

- ❌ **EXP-16**: a API aceita 1.000.000 de unidades (mesma causa do [BUG-02](bugs/BUG-02.md)).
- ⚠️ **EXP-12**: CEP com espaço no lugar do hífen é recusado (interpretação: aceitável, a regra só cita o hífen).
- ✅ As outras 15 verificações (navegação, cupom, checkout, celular e API) tiveram o comportamento esperado.

## Automação

Testes Playwright em [`../automacao/tests`](../automacao/tests) · Evidências: [`evidencias/automacao`](evidencias/automacao) (relatório HTML e log do terminal)

Os testes que reproduzem bugs usam `test.fail()`: o Playwright os conta como aprovados enquanto o bug existir.

| ID    | Teste                                             | Tipo      | Resultado             |
|-------|---------------------------------------------------|-----------|-----------------------|
| CT-01 | Cupom em minúsculas e com espaços aplica 10%      | Interface | ✅                    |
| CT-02 | Cupom inexistente: "Cupom inválido."              | Interface | ✅                    |
| CT-03 | Cupom expirado: "Cupom expirado."                 | Interface | ✅                    |
| CT-04 | Apenas um cupom por vez                           | Interface | ✅                    |
| CT-05 | Abaixo de R$ 200: frete e quanto falta            | Interface | ✅                    |
| CT-06 | Exatamente R$ 200,00 tem frete grátis             | Interface | ❌ BUG-01 reproduzido |
| CT-07 | Frete grátis mantido após o cupom                 | Interface | ✅                    |
| CT-08 | Limite de 5 unidades na vitrine e no carrinho     | Interface | ✅                    |
| CT-09 | Compra completa com cupom                         | Interface | ✅                    |
| CT-10 | Checkout com dados inválidos                      | Interface | ✅                    |
| CT-11 | Desconto sem frete e arredondamento               | API       | ✅                    |
| CT-12 | API recusa mais de 5 unidades                     | API       | ❌ BUG-02 reproduzido |
| CT-13 | Itens inválidos retornam o código de erro         | API       | ✅                    |
| CT-14 | Pedido com os mesmos valores do carrinho          | API       | ✅                    |
| CT-15 | Cupom inválido: aviso no carrinho, erro no pedido | API       | ✅                    |
