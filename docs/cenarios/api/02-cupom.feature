# language: pt
@api @manual @cupom
Funcionalidade: Cupom de desconto no cálculo do carrinho (API)
  POST /api/carrinho/calcular calcula o carrinho sem gravar nada.
  Um cupom inválido ou expirado NÃO gera erro aqui: a resposta é 200, sem desconto,
  e o motivo vem em cupom.mensagem.

  @CA01
  Cenário: CTA-04 Cupom BEMVINDO10 aplica 10% sobre o subtotal (exemplo da documentação)
    Dado o corpo com 1 "P002" e 2 "P004" e o cupom "BEMVINDO10"
    Quando envio POST para "/api/carrinho/calcular"
    Então a resposta tem status 200
    E subtotal é 239.7, desconto é 23.97, frete é 0 e total é 215.73
    E cupom.aplicado é true com a mensagem "Cupom aplicado: 10% de desconto nos produtos."

  @CA02
  Cenário: CTA-05 Cupom em minúsculas e com espaços é aceito
    Dado o corpo com 1 "P001" e o cupom "  bemvindo10  "
    Quando envio POST para "/api/carrinho/calcular"
    Então a resposta tem status 200
    E cupom.codigo é "BEMVINDO10" e cupom.aplicado é true
    E desconto é 5.99

  @CA03 @automatizado-CT-15
  Cenário: CTA-06 Cupom inexistente não gera erro, mas não aplica desconto
    Dado o corpo com 1 "P001" e o cupom "CUPOMFAKE"
    Quando envio POST para "/api/carrinho/calcular"
    Então a resposta tem status 200
    E cupom.aplicado é false com a mensagem "Cupom inválido."
    E desconto é 0

  @CA04 @automatizado-CT-15
  Cenário: CTA-07 Cupom expirado não gera erro, mas não aplica desconto
    Dado o corpo com 1 "P001" e o cupom "VERAO2026"
    Quando envio POST para "/api/carrinho/calcular"
    Então a resposta tem status 200
    E cupom.aplicado é false com a mensagem "Cupom expirado."
    E desconto é 0

  Cenário: CTA-08 Sem cupom, o campo cupom vem nulo
    Dado o corpo com 1 "P001" e sem o campo cupom
    Quando envio POST para "/api/carrinho/calcular"
    Então a resposta tem status 200
    E cupom é null e desconto é 0
