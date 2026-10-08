import { expect, Locator } from '@playwright/test';

type Linha = 'Subtotal' | 'Desconto' | 'Frete' | 'Total';
export type ResumoEsperado = Partial<Record<Linha, string>>;

/**
 * Bloco "Resumo do pedido" exibido no carrinho, no checkout e na confirmação.
 * É uma lista de definição (term/definition): "Subtotal" -> "R$ 139,90".
 */
export class ResumoPedido {
  constructor(readonly root: Locator) {}

  /** Valor ao lado do rótulo. O desconto aparece como "Desconto (BEMVINDO10)". */
  valor(linha: Linha): Locator {
    return this.rotulo(linha).locator('xpath=following-sibling::*[1]');
  }

  rotulo(linha: Linha): Locator {
    return this.root.getByRole('term').filter({ hasText: new RegExp(`^${linha}`) });
  }

  get mensagemFreteGratis(): Locator {
    return this.root.getByText(/para o frete grátis/);
  }

  async deveExibir(esperado: ResumoEsperado): Promise<void> {
    for (const [linha, valor] of Object.entries(esperado) as [Linha, string][]) {
      await expect(this.valor(linha), `Linha "${linha}" do resumo`).toHaveText(valor);
    }
  }
}
