# Testes exploratórios

Execução baseada em sessões curtas (*Session-Based Testing*): cada sessão tem uma missão e um tempo definido, e explora situações fora dos cenários roteirizados.
Cada verificação tem a sua pasta de evidência (gravação em GIF) em [`docs/evidencias/exploratorio`](../evidencias/exploratorio).

**Ambiente:** https://verzel-store.qa-test-verzel-store.workers.dev · Microsoft Edge · Postman
**Legenda:** ✅ comportamento esperado · ⚠️ observação ou ambiguidade · ❌ bug

---

## Sessão 1 · Carrinho e navegação

**Missão:** verificar o comportamento da loja fora do caminho feliz: recarregar, trocar de aba e voltar.

| ID                                                                 | O que foi feito                                               | Esperado                               | Resultado                    |
|--------------------------------------------------------------------|---------------------------------------------------------------|----------------------------------------|------------------------------|
| [EXP-01](../evidencias/exploratorio/EXP-01_f5-com-cupom)           | Carrinho com cupom aplicado → **F5**                          | Carrinho e cupom continuam             | ✅ Carrinho e cupom mantidos |
| [EXP-02](../evidencias/exploratorio/EXP-02_nova-aba)               | Abrir a loja numa **nova aba**                                | Carrinho vazio ("Sobre este ambiente") | ✅ Carrinho vazio            |
| [EXP-03](../evidencias/exploratorio/EXP-03_voltar-apos-pedido)     | Confirmar um pedido e apertar **Voltar** no navegador         | Carrinho vazio; o pedido não é refeito | ✅ Carrinho vazio            |
| [EXP-04](../evidencias/exploratorio/EXP-04_duplo-clique-confirmar) | **Duplo clique** em "Confirmar pedido", com a aba Rede aberta | Apenas 1 requisição `pedidos`          | ✅ Apenas 1 pedido criado    |

## Sessão 2 · Cupom

**Missão:** usar o campo de cupom de formas não previstas nos cenários.

| ID                                                                        | O que foi feito                                                        | Esperado                                      | Resultado                                          |
|---------------------------------------------------------------------------|------------------------------------------------------------------------|-----------------------------------------------|----------------------------------------------------|
| [EXP-05](../evidencias/exploratorio/EXP-05_esvaziar-com-cupom)            | Aplicar o cupom → **Esvaziar carrinho** → adicionar um produto de novo | Observar se o cupom continua aplicado         | ✅ O cupom é descartado junto com o carrinho       |
| [EXP-06](../evidencias/exploratorio/EXP-06_diminuir-quantidade-com-cupom) | 2 Calças (R$ 279,80) + cupom → diminuir para 1                         | Frete volta a R$ 19,90 e desconto recalculado | ✅ Frete e desconto recalculados                   |
| [EXP-07](../evidencias/exploratorio/EXP-07_enter-no-cupom)                | Digitar o cupom e apertar **Enter**                                    | O cupom é aplicado                            | ✅ Cupom aplicado                                  |
| [EXP-08](../evidencias/exploratorio/EXP-08_cupom-so-espacos)              | Cupom só com espaços                                                   | Tratado como vazio                            | ✅ Cupom não aplicado                              |
| [EXP-09](../evidencias/exploratorio/EXP-09_cupom-caracteres-especiais)    | Cupom `<b>teste</b>`                                                   | "Cupom inválido."; o texto não vira negrito   | ✅ "Cupom inválido.", texto exibido sem formatação |

## Sessão 3 · Checkout

**Missão:** testar entradas comuns no dia a dia que os cenários não cobrem.

| ID                                                           | O que foi feito                             | Esperado                                                      | Resultado                                                                                                               |
|--------------------------------------------------------------|---------------------------------------------|---------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| [EXP-10](../evidencias/exploratorio/EXP-10_nome-com-acentos) | Nome `José da Silva Ávila`                  | Aceito                                                        | ✅ Aceito                                                                                                               |
| [EXP-11](../evidencias/exploratorio/EXP-11_nome-com-espacos) | Nome `  Maria Silva  ` (espaços nas pontas) | Aceito                                                        | ✅ Aceito                                                                                                               |
| [EXP-12](../evidencias/exploratorio/EXP-12_cep-com-espaco)   | CEP `01310 100` (espaço no lugar do hífen)  | A documentação aceita "com ou sem hífen"; espaço não é citado | ⚠️ Recusado com "Informe um CEP com 8 dígitos.". Interpretação: comportamento aceitável, já que a regra só cita o hífen |

## Sessão 4 · Consistência e acessibilidade

**Missão:** verificar se as telas conversam entre si e se a loja funciona no celular.

| ID                                                             | O que foi feito                                                       | Esperado                              | Resultado                    |
|----------------------------------------------------------------|-----------------------------------------------------------------------|---------------------------------------|------------------------------|
| [EXP-13](../evidencias/exploratorio/EXP-13_limite-entre-telas) | 5 Bonés pela vitrine → diminuir para 2 no carrinho → voltar à vitrine | O botão "Adicionar" volta a funcionar | ✅ Botão liberado            |
| [EXP-14](../evidencias/exploratorio/EXP-14_celular)            | Compra completa no modo dispositivo (celular)                         | Telas legíveis, nenhum botão cortado  | ✅ Fluxo completo no celular |

## Sessão 5 · API

**Missão:** explorar entradas da API que a tabela de códigos de erro não cita.

| ID                                                                 | O que foi feito                                                | Esperado                                  | Resultado                                                                                              |
|--------------------------------------------------------------------|----------------------------------------------------------------|-------------------------------------------|--------------------------------------------------------------------------------------------------------|
| [EXP-15](../evidencias/exploratorio/EXP-15_api-campos-extras)      | Enviar campos extras: `"desconto": 50, "frete": 0, "total": 1` | A API ignora e calcula os valores sozinha | ✅ Campos ignorados; valores calculados pela API                                                       |
| [EXP-16](../evidencias/exploratorio/EXP-16_api-quantidade-1000000) | `"quantidade": 1000000`                                        | 422 (limite de 5 unidades, CA10)          | ❌ **200**: 1.000.000 unidades aceitas, subtotal de R$ 59.900.000,00. Mesma causa do [BUG-02](../bugs) |
| [EXP-17](../evidencias/exploratorio/EXP-17_api-cupom-numerico)     | `"cupom": 123` (número em vez de texto)                        | Tratado como cupom inválido, sem erro 500 | ✅ 200 com `"codigo": "123"`, `"aplicado": false` e "Cupom inválido."                                  |

---

## Resumo

| Total | ✅  | ⚠️  | ❌  |
|-------|-----|-----|-----|
| 17    | 15  | 1   | 1   |

- **Bugs:** nenhum bug novo. O EXP-16 reforça o **BUG-02**: a API não aplica o limite de 5 unidades e aceita até 1.000.000.
- **Observação:** EXP-12, o CEP com espaço é recusado (interpretação registrada).
- A loja se mostrou estável nos fluxos de navegação, cupom, checkout e celular.
