import { Carrinho } from '../../api/carrinho';
import { BUGS } from '../../data/bugs';
import { CUPONS, PRODUTOS, REGRAS } from '../../data/massa';
import { expect, test } from '../../fixtures';

const { CAMISETA, TENIS, MOCHILA, MEIAS } = PRODUTOS;

test.describe('API · Cálculo do carrinho', { tag: ['@api', '@calculo'] }, () => {
  test('CT-11 · desconto não incide sobre o frete e os valores são arredondados em 2 casas', { tag: ['@CA09', '@CA11'] }, async ({ api }) => {
    await test.step('Mochila (R$ 100,00) + BEMVINDO10: desconto de R$ 10,00, e não R$ 11,99 (que incluiria o frete)', async () => {
      const resumo = await api.calcularResumo(Carrinho.com(MOCHILA).comCupom(CUPONS.BEMVINDO10));

      expect(resumo).toMatchObject({ subtotal: 100, desconto: 10, frete: 19.9, total: 109.9 });
    });

    await test.step('Tênis + Meias (R$ 219,80) + BEMVINDO10: desconto R$ 21,98 e total R$ 197,82, sem resíduo de ponto flutuante', async () => {
      // Em JavaScript, 219.8 * 0.1 = 21.980000000000004 e 219.8 - 21.98 = 197.82000000000002.
      // Sem arredondamento, a API devolveria esses valores "sujos" em vez de 21.98 e 197.82.
      const resumo = await api.calcularResumo(Carrinho.com(TENIS).e(MEIAS).comCupom(CUPONS.BEMVINDO10));

      expect(resumo).toMatchObject({ subtotal: 219.8, desconto: 21.98, frete: 0, total: 197.82 });

      const valores = [resumo.subtotal, resumo.desconto, resumo.frete, resumo.total, resumo.valorFaltanteFreteGratis];
      for (const valor of valores) {
        expect.soft(Math.round(valor * 100) / 100, `${valor} deveria ter no máximo 2 casas decimais`).toBe(valor);
      }
    });
  });

  test.fail(
    'CT-12 · API recusa mais de 5 unidades do mesmo produto',
    { tag: ['@CA10', '@quantidade', '@bug'], annotation: BUGS.QUANTIDADE_MAXIMA_API },
    async ({ api }) => {
      await test.step('5 unidades são aceitas', async () => {
        const resumo = await api.calcularResumo(Carrinho.com(CAMISETA, REGRAS.QUANTIDADE_MAXIMA));
        expect(resumo.subtotal).toBe(299.5);
      });

      await test.step('6 unidades retornam 422 QUANTIDADE_MAXIMA_EXCEDIDA', async () => {
        const resposta = await api.calcular(Carrinho.com(CAMISETA, REGRAS.QUANTIDADE_MAXIMA + 1));

        await expect(resposta).toBeErroDaApi({
          status: 422,
          codigo: 'QUANTIDADE_MAXIMA_EXCEDIDA',
          campo: 'itens[0].quantidade',
        });
      });
    },
  );

  test('CT-13 · itens inválidos retornam o código de erro da documentação', { tag: '@contrato' }, async ({ api }) => {
    const item = (produtoId: string, quantidade: unknown) => ({ produtoId, quantidade });
    const casos = [
      { situacao: 'lista de itens vazia', corpo: { itens: [] }, codigo: 'ITENS_OBRIGATORIOS', campo: 'itens' },
      { situacao: 'item que não é objeto', corpo: { itens: ['P001'] }, codigo: 'ITEM_INVALIDO', campo: 'itens[0]' },
      { situacao: 'produto inexistente', corpo: { itens: [item('P999', 1)] }, codigo: 'PRODUTO_NAO_ENCONTRADO', campo: 'itens[0].produtoId' },
      { situacao: 'produto repetido', corpo: { itens: [item('P001', 1), item('P001', 2)] }, codigo: 'ITEM_DUPLICADO', campo: 'itens[1].produtoId' },
      { situacao: 'quantidade zero', corpo: { itens: [item('P001', 0)] }, codigo: 'QUANTIDADE_INVALIDA', campo: 'itens[0].quantidade' },
      { situacao: 'quantidade decimal', corpo: { itens: [item('P001', 1.5)] }, codigo: 'QUANTIDADE_INVALIDA', campo: 'itens[0].quantidade' },
    ];

    for (const { situacao, corpo, codigo, campo } of casos) {
      await test.step(`${situacao} → 422 ${codigo}`, async () => {
        const resposta = await api.calcularComCorpo(corpo);

        // soft: um caso com problema não esconde o resultado dos demais
        await expect.soft(resposta).toBeErroDaApi({ status: 422, codigo, campo });
      });
    }
  });
});
