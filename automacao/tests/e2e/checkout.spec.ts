import { CLIENTE_VALIDO, CUPONS, MENSAGENS, PRODUTOS } from '../../data/massa';
import { expect, test } from '../../fixtures';
import { brl } from '../../utils/moeda';

const { CALCA } = PRODUTOS;

test.describe('Finalização da compra', { tag: ['@e2e', '@checkout'] }, () => {
  test.beforeEach(async ({ vitrine }) => {
    await test.step(`Dado que o cliente tem 1 "${CALCA.nome}" no carrinho`, async () => {
      await vitrine.abrir();
      await vitrine.adicionar(CALCA);
      await vitrine.irParaCarrinho();
    });
  });

  test('CT-09 · compra completa com cupom gera pedido com os mesmos valores do carrinho', { tag: '@cupom' }, async ({
    page,
    vitrine,
    carrinho,
    checkout,
    confirmacao,
  }) => {
    const valoresComCupom = {
      Subtotal: brl(139.9),
      Desconto: `- ${brl(13.99)}`,
      Frete: brl(19.9),
      Total: brl(145.81),
    };

    await test.step(`E aplica o cupom ${CUPONS.BEMVINDO10}`, async () => {
      await carrinho.aplicarCupom(CUPONS.BEMVINDO10);
      await expect(carrinho.cupomAplicado(CUPONS.BEMVINDO10)).toBeVisible();
    });

    await test.step('Quando vai para o checkout, o desconto é mantido', async () => {
      await carrinho.finalizarCompra();
      await checkout.resumo.deveExibir(valoresComCupom);
    });

    const pedido = await test.step('E confirma o pedido com dados válidos', async () => {
      await checkout.preencher(CLIENTE_VALIDO);
      const [resposta] = await Promise.all([
        page.waitForResponse((r) => r.url().endsWith('/api/pedidos')),
        checkout.confirmar(),
      ]);
      expect(resposta.status()).toBe(201);
      return resposta.json();
    });

    await test.step(`Então vê a confirmação do pedido ${pedido.numero}`, async () => {
      await expect(page).toHaveURL(/\/pedido-confirmado$/);
      await expect(confirmacao.titulo).toHaveText(`Pedido ${pedido.numero}`);
      await expect(confirmacao.titulo).toHaveText(/^Pedido VZ-\d{6}$/);
      await expect(page.getByText('Obrigado, Maria.')).toBeVisible();
    });

    await test.step('E os valores confirmados são os mesmos do carrinho', async () => {
      await confirmacao.resumo.deveExibir(valoresComCupom);
    });

    await test.step('E o carrinho é esvaziado', async () => {
      await expect(vitrine.linkCarrinho).toHaveAccessibleName(/0 itens no carrinho/);
    });
  });

  test('CT-10 · dados inválidos mostram o erro de cada campo e não enviam o pedido', async ({ page, carrinho, checkout }) => {
    const pedidosEnviados: string[] = [];
    page.on('request', (r) => {
      if (r.method() === 'POST' && r.url().endsWith('/api/pedidos')) pedidosEnviados.push(r.url());
    });

    await test.step('Quando confirma o pedido com nome sem sobrenome, e-mail incompleto e CEP curto', async () => {
      await carrinho.finalizarCompra();
      await checkout.preencher({ nome: 'Maria', email: 'maria@exemplo', cep: '0131' });
      await checkout.confirmar();
    });

    await test.step('Então cada campo é marcado com a sua mensagem de erro', async () => {
      const esperado = [
        [checkout.campoNome, MENSAGENS.NOME_INVALIDO],
        [checkout.campoEmail, MENSAGENS.EMAIL_INVALIDO],
        [checkout.campoCep, MENSAGENS.CEP_INVALIDO],
      ] as const;
      for (const [campo, mensagem] of esperado) {
        await expect(campo).toHaveAttribute('aria-invalid', 'true');
        await expect(page.getByText(mensagem)).toBeVisible();
      }
    });

    await test.step('E o cliente continua no checkout, sem nenhum pedido enviado à API', async () => {
      await expect(page).toHaveURL(/\/checkout$/);
      expect(pedidosEnviados).toHaveLength(0);
    });
  });
});
