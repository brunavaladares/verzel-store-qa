import { BUGS } from '../../data/bugs';
import { CUPONS, PRODUTOS } from '../../data/massa';
import { expect, test } from '../../fixtures';
import { brl } from '../../utils/moeda';

const { CAMISETA, TENIS, MOCHILA, MEIAS } = PRODUTOS;

test.describe('Frete grátis a partir de R$ 200,00', { tag: ['@e2e', '@frete'] }, () => {
  test.beforeEach(async ({ vitrine }) => {
    await vitrine.abrir();
  });

  test('CT-05 · abaixo de R$ 200,00 cobra R$ 19,90 e informa quanto falta', { tag: '@CA07' }, async ({ vitrine, carrinho }) => {
    await test.step(`Dado um carrinho com 1 "${CAMISETA.nome}" (R$ 59,90)`, async () => {
      await vitrine.adicionar(CAMISETA);
      await vitrine.irParaCarrinho();
    });

    await test.step('Então o frete é cobrado e a loja informa quanto falta para o frete grátis', async () => {
      await carrinho.resumo.deveExibir({ Subtotal: brl(59.9), Frete: brl(19.9), Total: brl(79.8) });
      await expect(carrinho.resumo.mensagemFreteGratis).toHaveText(`Faltam ${brl(140.1)} para o frete grátis.`);
    });
  });

  test.fail(
    'CT-06 · subtotal de exatamente R$ 200,00 tem frete grátis',
    { tag: ['@CA06', '@bug'], annotation: BUGS.FRETE_GRATIS_200 },
    async ({ vitrine, carrinho }) => {
      await test.step(`Dado um carrinho com 2 "${MOCHILA.nome}" (R$ 200,00)`, async () => {
        await vitrine.adicionar(MOCHILA, 2);
        await vitrine.irParaCarrinho();
      });

      await test.step('Então o frete é grátis e a mensagem de quanto falta não aparece', async () => {
        await carrinho.resumo.deveExibir({ Subtotal: brl(200), Frete: 'Grátis', Total: brl(200) });
        await expect(carrinho.resumo.mensagemFreteGratis).toBeHidden();
      });
    },
  );

  test('CT-07 · frete segue grátis quando o cupom deixa o total abaixo de R$ 200,00', { tag: ['@CA06', '@CA08', '@cupom'] }, async ({ vitrine, carrinho }) => {
    await test.step('Dado um carrinho de R$ 219,80, que já tem frete grátis', async () => {
      await vitrine.adicionar(TENIS);
      await vitrine.adicionar(MEIAS);
      await vitrine.irParaCarrinho();
      await carrinho.resumo.deveExibir({ Subtotal: brl(219.8), Frete: 'Grátis' });
      await expect(carrinho.resumo.mensagemFreteGratis).toBeHidden();
    });

    await test.step(`Quando aplica o cupom ${CUPONS.BEMVINDO10}`, async () => {
      await carrinho.aplicarCupom(CUPONS.BEMVINDO10);
    });

    await test.step('Então o total cai para R$ 197,82 e o frete continua grátis', async () => {
      await carrinho.resumo.deveExibir({
        Subtotal: brl(219.8),
        Desconto: `- ${brl(21.98)}`,
        Frete: 'Grátis',
        Total: brl(197.82),
      });
    });
  });
});
