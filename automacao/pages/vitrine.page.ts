import { expect, Locator, Page } from '@playwright/test';
import { Produto } from '../data/massa';

export class VitrinePage {
  readonly linkCarrinho: Locator;

  constructor(readonly page: Page) {
    this.linkCarrinho = page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name: /Carrinho/ });
  }

  async abrir(): Promise<void> {
    await this.page.goto('/');
    await expect(this.page.getByRole('heading', { name: 'Produtos' })).toBeVisible();
  }

  card(produto: Produto): Locator {
    return this.page.getByRole('article', { name: produto.nome });
  }

  botaoAdicionar(produto: Produto): Locator {
    return this.card(produto).getByRole('button', { name: 'Adicionar ao carrinho' });
  }

  /**
   * Adiciona o produto clicando N vezes e espera o card confirmar cada clique.
   * Ao atingir o limite, o card troca "N no carrinho" por "Limite de 5 unidades atingido.".
   */
  async adicionar(produto: Produto, quantidade = 1): Promise<void> {
    for (let n = 1; n <= quantidade; n++) {
      await this.botaoAdicionar(produto).click();
      await expect(this.card(produto)).toContainText(new RegExp(`${n} no carrinho|Limite de ${n} unidades atingido`));
    }
  }

  async irParaCarrinho(): Promise<void> {
    await this.linkCarrinho.click();
    await expect(this.page.getByRole('heading', { name: 'Carrinho', level: 1 })).toBeVisible();
  }
}
