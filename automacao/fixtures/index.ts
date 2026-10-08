import { test as base } from '@playwright/test';
import { VerzelApi } from '../api/verzel-api';
import { CarrinhoPage } from '../pages/carrinho.page';
import { CheckoutPage } from '../pages/checkout.page';
import { ConfirmacaoPage } from '../pages/confirmacao.page';
import { VitrinePage } from '../pages/vitrine.page';

type Fixtures = {
  api: VerzelApi;
  vitrine: VitrinePage;
  carrinho: CarrinhoPage;
  checkout: CheckoutPage;
  confirmacao: ConfirmacaoPage;
};

export const test = base.extend<Fixtures>({
  api: async ({ request }, use) => use(new VerzelApi(request)),
  vitrine: async ({ page }, use) => use(new VitrinePage(page)),
  carrinho: async ({ page }, use) => use(new CarrinhoPage(page)),
  checkout: async ({ page }, use) => use(new CheckoutPage(page)),
  confirmacao: async ({ page }, use) => use(new ConfirmacaoPage(page)),
});

export { expect } from './matchers';
