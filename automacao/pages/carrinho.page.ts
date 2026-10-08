import { expect, Locator, Page } from '@playwright/test';
import { Produto } from '../data/massa';
import { ResumoPedido } from './components/resumo-pedido.component';

export class CarrinhoPage {
  readonly resumo: ResumoPedido;
  readonly campoCupom: Locator;
  readonly botaoAplicarCupom: Locator;
  readonly botaoRemoverCupom: Locator;
  readonly alerta: Locator;
  readonly avisoLimite: Locator;

  constructor(readonly page: Page) {
    this.resumo = new ResumoPedido(page.getByRole('region', { name: 'Resumo do pedido' }));
    this.campoCupom = page.getByRole('textbox', { name: 'Cupom de desconto' });
    this.botaoAplicarCupom = page.getByRole('button', { name: 'Aplicar cupom' });
    this.botaoRemoverCupom = page.getByRole('button', { name: 'Remover cupom' });
    this.alerta = page.getByRole('alert');
    this.avisoLimite = page.getByText(/^Limite de \d+ unidades por produto\.$/);
  }

  cupomAplicado(codigo: string): Locator {
    return this.page.getByText(`Cupom ${codigo} aplicado.`);
  }

  quantidade(produto: Produto): Locator {
    return this.page.getByRole('status', { name: `Quantidade de ${produto.nome}` });
  }

  botaoAumentar(produto: Produto): Locator {
    return this.page.getByRole('button', { name: `Aumentar quantidade de ${produto.nome}` });
  }

  async aplicarCupom(codigo: string): Promise<void> {
    await this.campoCupom.fill(codigo);
    await this.botaoAplicarCupom.click();
  }

  async removerCupom(): Promise<void> {
    await this.botaoRemoverCupom.click();
    await expect(this.campoCupom).toBeVisible();
  }

  async aumentar(produto: Produto, vezes = 1): Promise<void> {
    for (let i = 0; i < vezes; i++) {
      const atual = Number(await this.quantidade(produto).innerText());
      await this.botaoAumentar(produto).click();
      await expect(this.quantidade(produto)).toHaveText(String(atual + 1));
    }
  }

  async finalizarCompra(): Promise<void> {
    await this.resumo.root.getByRole('link', { name: 'Finalizar compra' }).click();
    await expect(this.page.getByRole('heading', { name: 'Finalizar compra', level: 1 })).toBeVisible();
  }
}
