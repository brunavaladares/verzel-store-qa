# language: pt
@api @manual @erros
Funcionalidade: Validações e códigos de erro da API
  Todo erro segue o formato { "erro": { "codigo", "mensagem", "campo" } },
  conforme a tabela "Códigos de erro" da documentação.

  @automatizado-CT-13
  Cenário: CTA-16 Lista de itens vazia
    Dado o corpo {"itens": []}
    Quando envio POST para "/api/carrinho/calcular"
    Então a resposta tem status 422
    E o erro tem o código "ITENS_OBRIGATORIOS" e o campo "itens"

  @automatizado-CT-13
  Cenário: CTA-17 Item que não é um objeto com produtoId e quantidade
    Dado o corpo {"itens": ["P001"]}
    Quando envio POST para "/api/carrinho/calcular"
    Então a resposta tem status 422
    E o erro tem o código "ITEM_INVALIDO" e o campo "itens[0]"

  @automatizado-CT-13
  Cenário: CTA-18 Item com produto inexistente
    Dado o corpo com 1 "P999"
    Quando envio POST para "/api/carrinho/calcular"
    Então a resposta tem status 422
    E o erro tem o código "PRODUTO_NAO_ENCONTRADO" e o campo "itens[0].produtoId"

  @automatizado-CT-13
  Cenário: CTA-19 O mesmo produto aparece duas vezes na lista
    Dado o corpo com 1 "P001" e, em outra linha, 2 "P001"
    Quando envio POST para "/api/carrinho/calcular"
    Então a resposta tem status 422
    E o erro tem o código "ITEM_DUPLICADO" e o campo "itens[1].produtoId"

  @automatizado-CT-13
  Esquema do Cenário: CTA-20 Quantidade que não é um inteiro maior ou igual a 1
    Dado o corpo com o produto "P001" e quantidade <quantidade>
    Quando envio POST para "/api/carrinho/calcular"
    Então a resposta tem status 422
    E o erro tem o código "QUANTIDADE_INVALIDA" e o campo "itens[0].quantidade"

    Exemplos:
      | quantidade | situação |
      | 0          | zero     |
      | -1         | negativa |
      | 1.5        | decimal  |
      | "2"        | texto    |

  Cenário: CTA-21 Corpo que não é um JSON válido
    Dado o corpo {itens: [
    Quando envio POST para "/api/carrinho/calcular"
    Então a resposta tem status 400
    E o erro tem o código "JSON_INVALIDO"

  Cenário: CTA-22 Rota inexistente
    Quando envio GET para "/api/nao-existe"
    Então a resposta tem status 404
    E o erro tem o código "ROTA_NAO_ENCONTRADA"

  Cenário: CTA-23 Método não permitido em uma rota existente
    Quando envio GET para "/api/carrinho/calcular"
    Então a resposta tem status 405
    E o erro tem o código "METODO_NAO_PERMITIDO"
