import { Cliente } from '../data/massa';

export interface ItemRequisicao {
  produtoId: string;
  quantidade: number;
}

export interface CorpoCarrinho {
  itens: ItemRequisicao[];
  cupom?: string;
}

export interface ItemCalculado extends ItemRequisicao {
  nome: string;
  precoUnitario: number;
  total: number;
}

export interface ResultadoCupom {
  codigo: string;
  aplicado: boolean;
  mensagem: string;
}

export interface ResumoCarrinho {
  itens: ItemCalculado[];
  subtotal: number;
  desconto: number;
  frete: number;
  freteGratis: boolean;
  valorFaltanteFreteGratis: number;
  total: number;
  cupom: ResultadoCupom | null;
}

export interface Pedido extends ResumoCarrinho {
  numero: string;
  criadoEm: string;
  cliente: Cliente;
}
