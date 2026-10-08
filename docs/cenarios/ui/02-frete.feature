# language: pt
@ui @manual @frete
Funcionalidade: Frete grátis no carrinho
  Como cliente da Verzel Store
  Quero ganhar frete grátis em compras a partir de R$ 200,00
  Para pagar menos nas minhas compras

  Regras:
  - Subtotal a partir de R$ 200,00, inclusive: frete grátis (CA06)
  - Abaixo de R$ 200,00: frete de R$ 19,90 e a loja informa quanto falta (CA07)
  - O frete grátis considera o subtotal antes do desconto (CA08)
  - O desconto do cupom não incide sobre o frete (CA09)

  Contexto:
    Dado que o cliente está na loja com o carrinho vazio

  @CA07 @automatizado-CT-05
  Cenário: CTM-11 Abaixo de R$ 200,00 é cobrado frete e a loja informa quanto falta
    Quando adiciona 1 "Camiseta Essencial" (R$ 59,90) e acessa o carrinho
    Então o resumo exibe Subtotal "R$ 59,90", Frete "R$ 19,90" e Total "R$ 79,80"
    E vê a mensagem "Faltam R$ 140,10 para o frete grátis."

  @CA07
  Cenário: CTM-12 Valor-limite inferior: R$ 199,90 ainda paga frete e faltam R$ 0,10
    Quando adiciona 3 "Garrafa Térmica 750ml" e 1 "Boné Aba Curva" e acessa o carrinho
    Então o resumo exibe Subtotal "R$ 199,90", Frete "R$ 19,90" e Total "R$ 219,80"
    E vê a mensagem "Faltam R$ 0,10 para o frete grátis."

  @CA06 @bug @BUG-01 @automatizado-CT-06
  Cenário: CTM-13 Valor-limite: subtotal de exatamente R$ 200,00 tem frete grátis
    Quando adiciona 2 "Mochila Urbana 20L" (R$ 100,00 cada) e acessa o carrinho
    Então o resumo exibe Subtotal "R$ 200,00", Frete "Grátis" e Total "R$ 200,00"
    E a mensagem de quanto falta para o frete grátis não aparece

  @CA06
  Cenário: CTM-14 Acima de R$ 200,00 o frete é grátis
    Quando adiciona 1 "Jaqueta Corta-Vento" (R$ 229,90) e acessa o carrinho
    Então o resumo exibe Frete "Grátis" e Total "R$ 229,90"
    E a mensagem de quanto falta para o frete grátis não aparece

  @CA06 @CA07
  Cenário: CTM-15 Frete é atualizado ao adicionar e remover produtos do carrinho
    Dado que o carrinho tem 1 "Camiseta Essencial" e mostra "Faltam R$ 140,10 para o frete grátis."
    Quando adiciona 1 "Jaqueta Corta-Vento" e volta ao carrinho
    Então o Frete passa a ser "Grátis" e o Total "R$ 289,80"
    Quando remove a "Jaqueta Corta-Vento" do carrinho
    Então o Frete volta a ser "R$ 19,90" e a mensagem "Faltam R$ 140,10 para o frete grátis." reaparece

  @CA08 @automatizado-CT-07
  Cenário: CTM-16 Frete continua grátis quando o cupom deixa o total abaixo de R$ 200,00
    Dado que o carrinho tem 1 "Tênis Casual Urbano" e 1 "Kit 3 Pares de Meias" (subtotal R$ 219,80)
    E o frete exibido é "Grátis"
    Quando aplica o cupom "BEMVINDO10"
    Então o resumo exibe Subtotal "R$ 219,80", Desconto (BEMVINDO10) "- R$ 21,98", Frete "Grátis" e Total "R$ 197,82"

  @CA08
  Cenário: CTM-17 O cupom não altera o valor que falta para o frete grátis
    Dado que o carrinho tem 3 "Garrafa Térmica 750ml" e 1 "Boné Aba Curva" (subtotal R$ 199,90)
    Quando aplica o cupom "BEMVINDO10"
    Então o resumo exibe Desconto (BEMVINDO10) "- R$ 19,99", Frete "R$ 19,90" e Total "R$ 199,81"
    E continua a mensagem "Faltam R$ 0,10 para o frete grátis."

  @CA09 @automatizado-CT-11
  Cenário: CTM-18 O desconto do cupom não incide sobre o frete
    # 10% de R$ 100,00 = R$ 10,00. Se incidisse sobre o frete, seriam R$ 11,99.
    Dado que o carrinho tem 1 "Mochila Urbana 20L" (R$ 100,00)
    Quando aplica o cupom "BEMVINDO10"
    Então o resumo exibe Subtotal "R$ 100,00", Desconto (BEMVINDO10) "- R$ 10,00", Frete "R$ 19,90" e Total "R$ 109,90"
