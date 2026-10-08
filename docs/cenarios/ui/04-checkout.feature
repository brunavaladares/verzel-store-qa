# language: pt
@ui @manual @checkout
Funcionalidade: Finalização da compra
  Como cliente da Verzel Store
  Quero finalizar a compra informando meus dados de entrega
  Para receber meus produtos e pagar na entrega

  Regras que já existiam antes desta entrega:
  - O nome precisa ter nome e sobrenome
  - O e-mail precisa ter um formato válido
  - O CEP precisa ter 8 dígitos, com ou sem hífen
  - O pagamento é feito na entrega

  Contexto:
    Dado que o cliente está na loja com o carrinho vazio

  @CA01 @automatizado-CT-09
  Cenário: CTM-23 Compra completa com cupom mantém os valores até a confirmação
    Dado que o carrinho tem 1 "Calça Jeans Slim" com o cupom "BEMVINDO10" aplicado
    Quando clica em "Finalizar compra"
    Então o resumo do checkout exibe Desconto (BEMVINDO10) "- R$ 13,99" e Total "R$ 145,81"
    Quando preenche nome "Maria Silva", e-mail "maria@exemplo.com" e CEP "01310-100"
    E clica em "Confirmar pedido"
    Então vê "Pedido confirmado" com um número no formato "VZ-000000"
    E vê "Obrigado, Maria." e que o pagamento será feito na entrega
    E o resumo exibe Subtotal "R$ 139,90", Desconto (BEMVINDO10) "- R$ 13,99", Frete "R$ 19,90" e Total "R$ 145,81"
    E o contador do carrinho no topo mostra 0

  @CA06
  Cenário: CTM-24 Compra sem cupom com frete grátis
    Dado que o carrinho tem 1 "Jaqueta Corta-Vento" (R$ 229,90)
    Quando finaliza a compra com dados válidos
    Então a confirmação exibe Desconto "R$ 0,00", Frete "Grátis" e Total "R$ 229,90"

  Cenário: CTM-25 Campos obrigatórios vazios
    Dado que o cliente está no checkout com 1 produto no carrinho
    Quando clica em "Confirmar pedido" sem preencher nada
    Então vê "Informe o nome completo.", "Informe o e-mail." e "Informe o CEP."
    E o pedido não é confirmado

  @automatizado-CT-10
  Cenário: CTM-26 Nome sem sobrenome é recusado
    Dado que o cliente está no checkout com 1 produto no carrinho
    Quando preenche nome "Maria", e-mail "maria@exemplo.com" e CEP "01310-100"
    E clica em "Confirmar pedido"
    Então vê a mensagem "Informe nome e sobrenome."
    E o pedido não é confirmado

  @automatizado-CT-10
  Esquema do Cenário: CTM-27 E-mail em formato inválido é recusado
    Dado que o cliente está no checkout com 1 produto no carrinho
    Quando preenche nome "Maria Silva", e-mail "<email>" e CEP "01310-100"
    E clica em "Confirmar pedido"
    Então vê a mensagem "Informe um e-mail válido."

    Exemplos:
      | email            |
      | maria@exemplo    |
      | mariaexemplo.com |

  @automatizado-CT-10
  Esquema do Cenário: CTM-28 CEP que não tem 8 dígitos é recusado
    Dado que o cliente está no checkout com 1 produto no carrinho
    Quando preenche nome "Maria Silva", e-mail "maria@exemplo.com" e CEP "<cep>"
    E clica em "Confirmar pedido"
    Então vê a mensagem "Informe um CEP com 8 dígitos."

    Exemplos:
      | cep       | situação        |
      | 0131      | dígitos a menos |
      | 013101000 | dígitos a mais  |
      | 01310-10a | contém letra    |

  Esquema do Cenário: CTM-29 CEP com 8 dígitos é aceito com ou sem hífen
    Dado que o cliente está no checkout com 1 produto no carrinho
    Quando preenche nome "Maria Silva", e-mail "maria@exemplo.com" e CEP "<cep>"
    E clica em "Confirmar pedido"
    Então vê "Pedido confirmado"

    Exemplos:
      | cep       |
      | 01310-100 |
      | 01310100  |
