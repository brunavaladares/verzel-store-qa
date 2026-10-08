import { Carrinho } from '../../api/carrinho';
import { CUPONS, MENSAGENS, PRODUTOS } from '../../data/massa';
import { expect, test } from '../../fixtures';

const { CALCA, BONE, MOCHILA } = PRODUTOS;

test.describe('API · Confirmação de pedido', { tag: ['@api', '@pedido'] }, () => {
  test('CT-14 · pedido confirmado tem os mesmos valores do cálculo do carrinho', { tag: '@cupom' }, async ({ api }) => {
    const carrinho = Carrinho.com(CALCA).e(BONE, 2).comCupom(CUPONS.BEMVINDO10);

    const calculado = await test.step('Calcula o carrinho (R$ 239,70 com BEMVINDO10)', () => api.calcularResumo(carrinho));
    const pedido = await test.step('Confirma o pedido com os mesmos itens e cupom', () => api.confirmarPedido(carrinho));

    await test.step('O pedido recebe número no formato VZ-000000', () => {
      expect(pedido.numero).toMatch(/^VZ-\d{6}$/);
      expect(Date.parse(pedido.criadoEm)).not.toBeNaN();
    });

    await test.step('Subtotal, desconto, frete, total e cupom são idênticos aos do carrinho', () => {
      const { numero, criadoEm, cliente, ...valoresDoPedido } = pedido;
      expect(valoresDoPedido).toEqual(calculado);
      expect(valoresDoPedido).toMatchObject({ subtotal: 239.7, desconto: 23.97, frete: 0, total: 215.73 });
    });
  });

  test('CT-15 · cupom inválido ou expirado é aviso no carrinho, mas bloqueia o pedido', { tag: ['@cupom', '@CA03', '@CA04'] }, async ({ api }) => {
    const casos = [
      { cupom: CUPONS.EXPIRADO, codigo: 'CUPOM_EXPIRADO', mensagem: MENSAGENS.CUPOM_EXPIRADO },
      { cupom: CUPONS.INEXISTENTE, codigo: 'CUPOM_INVALIDO', mensagem: MENSAGENS.CUPOM_INVALIDO },
    ];

    for (const { cupom, codigo, mensagem } of casos) {
      const carrinho = Carrinho.com(MOCHILA).comCupom(cupom);

      await test.step(`Cálculo do carrinho com "${cupom}": 200, sem desconto, mensagem "${mensagem}"`, async () => {
        const resumo = await api.calcularResumo(carrinho);
        expect(resumo.cupom).toMatchObject({ aplicado: false, mensagem });
        expect(resumo.desconto).toBe(0);
      });

      await test.step(`Pedido com "${cupom}": 422 ${codigo}`, async () => {
        const resposta = await api.criarPedido(carrinho);
        await expect(resposta).toBeErroDaApi({ status: 422, codigo, mensagem, campo: 'cupom' });
      });
    }
  });
});
