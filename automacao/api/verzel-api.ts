import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { Cliente, CLIENTE_VALIDO } from '../data/massa';
import { Carrinho } from './carrinho';
import { Pedido, ResumoCarrinho } from './tipos';

const ROTAS = {
  calcular: '/api/carrinho/calcular',
  pedidos: '/api/pedidos',
} as const;

/**
 * Os métodos que retornam `APIResponse` servem para validar status e erros.
 * Os métodos que retornam o corpo tipado já garantem o status de sucesso.
 */
export class VerzelApi {
  constructor(private readonly request: APIRequestContext) {}

  calcular(carrinho: Carrinho): Promise<APIResponse> {
    return this.request.post(ROTAS.calcular, { data: carrinho.toJSON() });
  }

  /** Envia ao cálculo do carrinho um corpo qualquer, para testar as validações da API. */
  calcularComCorpo(corpo: unknown): Promise<APIResponse> {
    return this.request.post(ROTAS.calcular, { data: corpo });
  }

  criarPedido(carrinho: Carrinho, cliente: Cliente = CLIENTE_VALIDO): Promise<APIResponse> {
    return this.request.post(ROTAS.pedidos, { data: { cliente, ...carrinho.toJSON() } });
  }

  async calcularResumo(carrinho: Carrinho): Promise<ResumoCarrinho> {
    return this.corpoComStatus<ResumoCarrinho>(await this.calcular(carrinho), 200);
  }

  async confirmarPedido(carrinho: Carrinho, cliente?: Cliente): Promise<Pedido> {
    return this.corpoComStatus<Pedido>(await this.criarPedido(carrinho, cliente), 201);
  }

  private async corpoComStatus<T>(resposta: APIResponse, status: number): Promise<T> {
    const corpo = await resposta.json();
    expect(resposta.status(), `${resposta.url()}\n${JSON.stringify(corpo)}`).toBe(status);
    return corpo as T;
  }
}
