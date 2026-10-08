import { PRODUTOS, REGRAS } from '../../data/massa';
import { expect, test } from '../../fixtures';
import { brl } from '../../utils/moeda';

const { CAMISETA } = PRODUTOS;

test.describe('Limite de 5 unidades por produto', { tag: ['@e2e', '@quantidade'] }, () => {
  test('CT-08 · vitrine e carrinho bloqueiam a 6ª unidade do mesmo produto', { tag: '@CA10' }, async ({ vitrine, carrinho }) => {
    await test.step(`Quando o cliente adiciona ${REGRAS.QUANTIDADE_MAXIMA} unidades de "${CAMISETA.nome}" pela vitrine`, async () => {
      await vitrine.abrir();
      await vitrine.adicionar(CAMISETA, REGRAS.QUANTIDADE_MAXIMA);
    });

    await test.step('Então o botão "Adicionar ao carrinho" é desabilitado com o aviso de limite', async () => {
      await expect(vitrine.botaoAdicionar(CAMISETA)).toBeDisabled();
      await expect(vitrine.card(CAMISETA)).toContainText('Limite de 5 unidades atingido.');
    });

    await test.step('E no carrinho o botão "+" também está bloqueado em 5 unidades', async () => {
      await vitrine.irParaCarrinho();
      await expect(carrinho.quantidade(CAMISETA)).toHaveText('5');
      await expect(carrinho.botaoAumentar(CAMISETA)).toBeDisabled();
      await expect(carrinho.avisoLimite).toHaveText('Limite de 5 unidades por produto.');
      await carrinho.resumo.deveExibir({ Subtotal: brl(299.5) });
    });
  });
});
