# language: pt
@api @manual @produtos
Funcionalidade: Consulta de produtos (API)
  Os produtos e preços são fixos e devem seguir a seção "Dados para teste" da documentação.

  Cenário: CTA-01 Listagem traz os 8 produtos com os preços da documentação
    Quando envio GET para "/api/produtos"
    Então a resposta tem status 200
    E a lista tem 8 produtos, de P001 a P008
    E os preços são: P001 59.9 · P002 139.9 · P003 189.9 · P004 49.9 · P005 100 · P006 29.9 · P007 229.9 · P008 50

  Cenário: CTA-02 Consulta de um produto pelo id
    Quando envio GET para "/api/produtos/P003"
    Então a resposta tem status 200
    E o produto retornado é "Tênis Casual Urbano" com preço 189.9

  Cenário: CTA-03 Consulta de produto inexistente
    Quando envio GET para "/api/produtos/P999"
    Então a resposta tem status 404
    E o erro tem o código "PRODUTO_NAO_ENCONTRADO"
