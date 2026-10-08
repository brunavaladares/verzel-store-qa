# language: pt
@api @manual @frete
Funcionalidade: Frete grátis e regras de cálculo (API)
  total = subtotal - desconto + frete
  Frete: 0 quando o subtotal é igual ou maior que 200; caso contrário, 19.9.
  Faltante para frete grátis: 200 menos o subtotal, nunca menor que zero.

  @CA07
  Cenário: CTA-09 Valor-limite inferior: subtotal de 199.90 paga frete
    Dado o corpo com 3 "P008" e 1 "P004"
    Quando envio POST para "/api/carrinho/calcular"
    Então subtotal é 199.9, frete é 19.9, freteGratis é false e valorFaltanteFreteGratis é 0.1
    E total é 219.8

  @CA06 @bug @BUG-01
  Cenário: CTA-10 Valor-limite: subtotal de exatamente 200.00 tem frete grátis
    Dado o corpo com 2 "P005"
    Quando envio POST para "/api/carrinho/calcular"
    Então subtotal é 200, frete é 0, freteGratis é true e valorFaltanteFreteGratis é 0
    E total é 200

  @CA06 @CA08 @automatizado-CT-11
  Cenário: CTA-11 Frete grátis considera o subtotal antes do desconto
    Dado o corpo com 1 "P003", 1 "P006" e o cupom "BEMVINDO10"
    Quando envio POST para "/api/carrinho/calcular"
    Então subtotal é 219.8, desconto é 21.98, frete é 0 e freteGratis é true
    E total é 197.82

  @CA09 @automatizado-CT-11
  Cenário: CTA-12 O desconto não incide sobre o frete
    # 10% de 100 = 10. Se incidisse sobre o frete, seria 11.99.
    Dado o corpo com 1 "P005" e o cupom "BEMVINDO10"
    Quando envio POST para "/api/carrinho/calcular"
    Então subtotal é 100, desconto é 10, frete é 19.9 e total é 109.9

  @CA11
  Cenário: CTA-13 Todos os valores têm no máximo 2 casas decimais
    Dado o corpo com 5 "P003", 5 "P002", 5 "P006" e o cupom "BEMVINDO10"
    Quando envio POST para "/api/carrinho/calcular"
    Então os totais dos itens são 949.5, 699.5 e 149.5
    E subtotal é 1798.5, desconto é 179.85 e total é 1618.65
    E nenhum valor da resposta tem mais de 2 casas decimais
