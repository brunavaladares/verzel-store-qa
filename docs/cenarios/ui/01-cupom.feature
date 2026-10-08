# language: pt
@ui @manual @cupom
Funcionalidade: Cupom de desconto no carrinho
  Como cliente da Verzel Store
  Quero aplicar um cupom de desconto no carrinho
  Para pagar menos nas minhas compras

  Contexto:
    Dado que o cliente está na loja com o carrinho vazio
    E adiciona 1 "Calça Jeans Slim" (R$ 139,90) ao carrinho
    E acessa o carrinho

  @CA01 @automatizado-CT-01
  Cenário: CTM-01 Cupom BEMVINDO10 aplica 10% de desconto sobre o subtotal
    Quando aplica o cupom "BEMVINDO10"
    Então vê a mensagem "Cupom BEMVINDO10 aplicado."
    E o resumo exibe Subtotal "R$ 139,90", Desconto (BEMVINDO10) "- R$ 13,99", Frete "R$ 19,90" e Total "R$ 145,81"

  @CA02 @automatizado-CT-01
  Cenário: CTM-02 Cupom digitado em letras minúsculas é aceito
    Quando aplica o cupom "bemvindo10"
    Então vê a mensagem "Cupom BEMVINDO10 aplicado."
    E o desconto exibido é "- R$ 13,99"

  @CA02 @automatizado-CT-01
  Cenário: CTM-03 Espaços no início e no fim do cupom são ignorados
    Quando aplica o cupom "   BEMVINDO10   " com espaços antes e depois
    Então vê a mensagem "Cupom BEMVINDO10 aplicado."
    E o desconto exibido é "- R$ 13,99"

  @CA03 @automatizado-CT-02
  Cenário: CTM-04 Cupom inexistente exibe "Cupom inválido." e não aplica desconto
    Quando aplica o cupom "CUPOMFAKE"
    Então vê a mensagem "Cupom inválido."
    E o desconto exibido é "R$ 0,00"
    E o total continua "R$ 159,80"

  @CA03
  Cenário: CTM-05 Tentativa de aplicar cupom com o campo vazio
    # A documentação não define este caso. Interpretação: nenhum desconto deve ser aplicado
    # e a loja deve orientar o cliente. Na execução, a loja exibiu "Informe um cupom.".
    Quando clica em "Aplicar cupom" sem digitar nada
    Então vê a mensagem "Informe um cupom."
    E o desconto exibido é "R$ 0,00"

  @CA04 @automatizado-CT-03
  Cenário: CTM-06 Cupom fora da validade exibe "Cupom expirado." e não aplica desconto
    Quando aplica o cupom "VERAO2026"
    Então vê a mensagem "Cupom expirado."
    E o desconto exibido é "R$ 0,00"
    E o total continua "R$ 159,80"

  @CA02 @CA04
  Cenário: CTM-07 Cupom expirado digitado em minúsculas também é reconhecido como expirado
    Quando aplica o cupom "verao2026"
    Então vê a mensagem "Cupom expirado."
    E não vê a mensagem "Cupom inválido."

  @CA05 @automatizado-CT-04
  Cenário: CTM-08 Apenas um cupom por vez: é preciso remover o atual para aplicar outro
    Dado que o cupom "BEMVINDO10" está aplicado
    Então o campo de cupom não fica disponível para digitar um segundo cupom
    Quando clica em "Remover cupom"
    Então o desconto volta a ser "R$ 0,00" e o campo de cupom reaparece
    Quando aplica o cupom "VERAO2026"
    Então vê a mensagem "Cupom expirado."

  @CA01
  Cenário: CTM-09 Desconto é recalculado quando a quantidade muda com o cupom aplicado
    Dado que o cupom "BEMVINDO10" está aplicado
    Quando aumenta a quantidade de "Calça Jeans Slim" para 2
    Então o resumo exibe Subtotal "R$ 279,80", Desconto (BEMVINDO10) "- R$ 27,98", Frete "Grátis" e Total "R$ 251,82"

  @CA11
  Cenário: CTM-10 Valores com desconto são exibidos com 2 casas decimais
    Dado que o carrinho tem 3 "Kit 3 Pares de Meias" e 1 "Camiseta Essencial", sem a "Calça Jeans Slim"
    Quando aplica o cupom "BEMVINDO10"
    Então a linha das meias exibe "R$ 89,70"
    E o resumo exibe Subtotal "R$ 149,60", Desconto (BEMVINDO10) "- R$ 14,96", Frete "R$ 19,90" e Total "R$ 154,54"
    E nenhum valor da tela tem mais de 2 casas decimais
