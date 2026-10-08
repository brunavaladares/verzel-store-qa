# language: pt
@api @manual @quantidade @CA10
Funcionalidade: Limite de 5 unidades por produto (API)
  Cada produto pode ter no máximo 5 unidades por pedido.
  A regra vale para a interface e para a API (CA10).

  @automatizado-CT-12
  Cenário: CTA-14 A API aceita exatamente 5 unidades do mesmo produto
    Dado o corpo com 5 "P001"
    Quando envio POST para "/api/carrinho/calcular"
    Então a resposta tem status 200
    E subtotal é 299.5

  @bug @BUG-02 @automatizado-CT-12
  Cenário: CTA-15 A API recusa 6 unidades do mesmo produto
    Dado o corpo com 6 "P001"
    Quando envio POST para "/api/carrinho/calcular"
    Então a resposta tem status 422
    E o erro tem o código "QUANTIDADE_MAXIMA_EXCEDIDA" e o campo "itens[0].quantidade"
