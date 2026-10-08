# language: pt
@ui @manual @quantidade
Funcionalidade: Quantidade de produtos no carrinho
  Cada produto pode ter no máximo 5 unidades por pedido (CA10).

  Contexto:
    Dado que o cliente está na loja com o carrinho vazio

  @CA10 @automatizado-CT-08
  Cenário: CTM-19 Na vitrine, o botão de adicionar é bloqueado ao chegar em 5 unidades
    Quando clica 5 vezes em "Adicionar ao carrinho" no "Boné Aba Curva"
    Então o botão "Adicionar ao carrinho" do boné fica desabilitado
    E o card do boné exibe "Limite de 5 unidades atingido."
    E o contador do carrinho no topo mostra 5

  @CA10 @automatizado-CT-08
  Cenário: CTM-20 No carrinho, o botão "+" é bloqueado em 5 unidades
    Dado que o carrinho tem 1 "Camiseta Essencial"
    Quando clica em "+" até a quantidade chegar a 5
    Então o botão "+" fica desabilitado
    E a loja exibe "Limite de 5 unidades por produto."
    E o Subtotal exibido é "R$ 299,50"

  @CA10
  Cenário: CTM-21 Diminuir a quantidade libera o botão "+" e o "-" para em 1 unidade
    Dado que o carrinho tem 5 "Camiseta Essencial" com o botão "+" desabilitado
    Quando clica em "-" uma vez
    Então a quantidade passa a 4, o botão "+" volta a ficar habilitado e o Subtotal é "R$ 239,60"
    Quando clica em "-" até a quantidade chegar a 1
    Então o botão "-" fica desabilitado

  Cenário: CTM-22 Remover um item e esvaziar o carrinho atualizam o resumo
    Dado que o carrinho tem 1 "Camiseta Essencial" e 1 "Boné Aba Curva"
    Quando clica em "Remover" no "Boné Aba Curva"
    Então o boné sai da lista e o Subtotal passa a "R$ 59,90"
    Quando clica em "Esvaziar carrinho"
    Então o carrinho fica vazio e o contador do topo mostra 0
