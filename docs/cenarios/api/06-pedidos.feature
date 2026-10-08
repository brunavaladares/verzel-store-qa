# language: pt
@api @manual @pedidos
Funcionalidade: Confirmação de pedido (API)
  POST /api/pedidos valida e confirma o pedido. Responde 201 com o número no formato VZ-000000
  e o mesmo resumo de valores do cálculo do carrinho.
  Diferente do cálculo do carrinho, aqui um cupom inválido ou expirado gera erro 422.

  Contexto:
    Dado um cliente com nome "Maria Silva", e-mail "maria@exemplo.com" e CEP "01310-100"

  @CA01 @automatizado-CT-14
  Cenário: CTA-24 Pedido válido com cupom (exemplo da documentação)
    Dado o corpo com 1 "P005" e o cupom "BEMVINDO10"
    Quando envio POST para "/api/pedidos"
    Então a resposta tem status 201
    E numero segue o formato "VZ-000000"
    E cliente.cep vem sem hífen: "01310100"
    E subtotal é 100, desconto é 10, frete é 19.9 e total é 109.9

  @CA04 @automatizado-CT-15
  Cenário: CTA-25 Pedido com cupom expirado é recusado
    Dado o corpo com 1 "P005" e o cupom "VERAO2026"
    Quando envio POST para "/api/pedidos"
    Então a resposta tem status 422
    E o erro tem o código "CUPOM_EXPIRADO", a mensagem "Cupom expirado." e o campo "cupom"

  @CA03 @automatizado-CT-15
  Cenário: CTA-26 Pedido com cupom inexistente é recusado
    Dado o corpo com 1 "P005" e o cupom "CUPOMFAKE"
    Quando envio POST para "/api/pedidos"
    Então a resposta tem status 422
    E o erro tem o código "CUPOM_INVALIDO", a mensagem "Cupom inválido." e o campo "cupom"

  Cenário: CTA-27 Dados do cliente inválidos retornam o detalhe de cada campo
    Dado um cliente com nome "Maria", e-mail "maria@" e CEP "0131"
    E o corpo com 1 "P005"
    Quando envio POST para "/api/pedidos"
    Então a resposta tem status 422
    E o erro tem o código "DADOS_INVALIDOS"
    E campos traz cliente.nome "Informe nome e sobrenome.", cliente.email "Informe um e-mail válido." e cliente.cep "Informe um CEP com 8 dígitos."

  @CA06 @bug @BUG-01
  Cenário: CTA-28 Pedido de exatamente 200.00 tem frete grátis
    Dado o corpo com 2 "P005"
    Quando envio POST para "/api/pedidos"
    Então a resposta tem status 201
    E frete é 0, freteGratis é true e total é 200

  @CA10 @bug @BUG-02
  Cenário: CTA-29 Pedido com 6 unidades do mesmo produto é recusado
    Dado o corpo com 6 "P005"
    Quando envio POST para "/api/pedidos"
    Então a resposta tem status 422
    E o erro tem o código "QUANTIDADE_MAXIMA_EXCEDIDA"
