import { Locator, Page } from '@playwright/test';
import { ResumoPedido } from './components/resumo-pedido.component';

export class ConfirmacaoPage {
  readonly resumo: ResumoPedido;
  readonly titulo: Locator;

  constructor(readonly page: Page) {
    this.resumo = new ResumoPedido(page.getByRole('region', { name: 'Itens do pedido' }));
    this.titulo = page.getByRole('heading', { level: 1 });
  }
}
