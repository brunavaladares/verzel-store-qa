import { Locator, Page } from '@playwright/test';
import { Cliente } from '../data/massa';
import { ResumoPedido } from './components/resumo-pedido.component';

export class CheckoutPage {
  readonly resumo: ResumoPedido;
  readonly campoNome: Locator;
  readonly campoEmail: Locator;
  readonly campoCep: Locator;
  readonly botaoConfirmar: Locator;

  constructor(readonly page: Page) {
    this.resumo = new ResumoPedido(page.getByRole('region', { name: 'Resumo do pedido' }));
    this.campoNome = page.getByRole('textbox', { name: 'Nome completo' });
    this.campoEmail = page.getByRole('textbox', { name: 'E-mail' });
    this.campoCep = page.getByRole('textbox', { name: 'CEP' });
    this.botaoConfirmar = page.getByRole('button', { name: 'Confirmar pedido' });
  }

  async preencher(cliente: Cliente): Promise<void> {
    await this.campoNome.fill(cliente.nome);
    await this.campoEmail.fill(cliente.email);
    await this.campoCep.fill(cliente.cep);
  }

  async confirmar(): Promise<void> {
    await this.botaoConfirmar.click();
  }
}
