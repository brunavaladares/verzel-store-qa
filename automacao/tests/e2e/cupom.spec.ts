import { CUPONS, MENSAGENS, PRODUTOS } from '../../data/massa';
import { expect, test } from '../../fixtures';
import { brl } from '../../utils/moeda';

const { CALCA } = PRODUTOS;

test.describe('Cupom de desconto no carrinho', { tag: ['@e2e', '@cupom'] }, () => {
  test.beforeEach(async ({ vitrine }) => {
    await test.step(`Dado que o cliente tem 1 "${CALCA.nome}" (R$ 139,90) no carrinho`, async () => {
      await vitrine.abrir();
      await vitrine.adicionar(CALCA);
      await vitrine.irParaCarrinho();
    });
  });

  test('CT-01 · cupom digitado em minúsculas e com espaços aplica 10% de desconto', { tag: ['@CA01', '@CA02'] }, async ({ carrinho }) => {
    await test.step('Quando aplica o cupom "  bemvindo10  "', async () => {
      await carrinho.aplicarCupom('  bemvindo10  ');
    });

    await test.step('Então o cupom BEMVINDO10 aparece como aplicado', async () => {
      await expect(carrinho.cupomAplicado(CUPONS.BEMVINDO10)).toBeVisible();
      await expect(carrinho.resumo.rotulo('Desconto')).toHaveText(`Desconto (${CUPONS.BEMVINDO10})`);
    });

    await test.step('E o resumo mostra 10% de desconto sobre os produtos', async () => {
      await carrinho.resumo.deveExibir({
        Subtotal: brl(139.9),
        Desconto: `- ${brl(13.99)}`,
        Frete: brl(19.9),
        Total: brl(145.81),
      });
    });
  });

  test('CT-02 · cupom inexistente mostra "Cupom inválido." e não dá desconto', { tag: '@CA03' }, async ({ carrinho }) => {
    await test.step(`Quando aplica o cupom "${CUPONS.INEXISTENTE}"`, async () => {
      await carrinho.aplicarCupom(CUPONS.INEXISTENTE);
    });

    await test.step('Então vê o alerta e o campo marcado como inválido', async () => {
      await expect(carrinho.alerta).toHaveText(MENSAGENS.CUPOM_INVALIDO);
      await expect(carrinho.campoCupom).toHaveAttribute('aria-invalid', 'true');
    });

    await test.step('E nenhum desconto é aplicado', async () => {
      await carrinho.resumo.deveExibir({ Desconto: brl(0), Total: brl(159.8) });
    });
  });

  test('CT-03 · cupom expirado mostra "Cupom expirado." e não dá desconto', { tag: '@CA04' }, async ({ carrinho }) => {
    await test.step(`Quando aplica o cupom "${CUPONS.EXPIRADO}" (vencido em 31/03/2026)`, async () => {
      await carrinho.aplicarCupom(CUPONS.EXPIRADO);
    });

    await test.step('Então vê o alerta de cupom expirado e nenhum desconto', async () => {
      await expect(carrinho.alerta).toHaveText(MENSAGENS.CUPOM_EXPIRADO);
      await carrinho.resumo.deveExibir({ Desconto: brl(0), Total: brl(159.8) });
    });
  });

  test('CT-04 · só um cupom por vez: é preciso remover o atual para trocar', { tag: '@CA05' }, async ({ carrinho }) => {
    await test.step(`Dado que o cupom ${CUPONS.BEMVINDO10} está aplicado`, async () => {
      await carrinho.aplicarCupom(CUPONS.BEMVINDO10);
    });

    await test.step('Então não há como informar um segundo cupom', async () => {
      await expect(carrinho.botaoRemoverCupom).toBeVisible();
      await expect(carrinho.campoCupom).toBeHidden();
      await expect(carrinho.botaoAplicarCupom).toBeHidden();
    });

    await test.step('Quando remove o cupom, o desconto sai do resumo', async () => {
      await carrinho.removerCupom();
      await carrinho.resumo.deveExibir({ Desconto: brl(0), Total: brl(159.8) });
    });

    await test.step(`E pode aplicar outro cupom (${CUPONS.EXPIRADO}), que é avaliado normalmente`, async () => {
      await carrinho.aplicarCupom(CUPONS.EXPIRADO);
      await expect(carrinho.alerta).toHaveText(MENSAGENS.CUPOM_EXPIRADO);
    });
  });
});
