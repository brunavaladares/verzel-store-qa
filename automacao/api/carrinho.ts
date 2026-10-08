import { Produto } from '../data/massa';
import { CorpoCarrinho, ItemRequisicao } from './tipos';

export class Carrinho {
  private readonly itens: ItemRequisicao[] = [];
  private cupom?: string;

  static com(produto: Produto, quantidade = 1): Carrinho {
    return new Carrinho().e(produto, quantidade);
  }

  e(produto: Produto, quantidade = 1): this {
    this.itens.push({ produtoId: produto.id, quantidade });
    return this;
  }

  comCupom(codigo: string): this {
    this.cupom = codigo;
    return this;
  }

  toJSON(): CorpoCarrinho {
    return this.cupom === undefined ? { itens: this.itens } : { itens: this.itens, cupom: this.cupom };
  }
}
