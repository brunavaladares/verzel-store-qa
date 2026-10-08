export const PRODUTOS = {
  CAMISETA: { id: 'P001', nome: 'Camiseta Essencial', preco: 59.9 },
  CALCA: { id: 'P002', nome: 'Calça Jeans Slim', preco: 139.9 },
  TENIS: { id: 'P003', nome: 'Tênis Casual Urbano', preco: 189.9 },
  BONE: { id: 'P004', nome: 'Boné Aba Curva', preco: 49.9 },
  MOCHILA: { id: 'P005', nome: 'Mochila Urbana 20L', preco: 100 },
  MEIAS: { id: 'P006', nome: 'Kit 3 Pares de Meias', preco: 29.9 },
  JAQUETA: { id: 'P007', nome: 'Jaqueta Corta-Vento', preco: 229.9 },
  GARRAFA: { id: 'P008', nome: 'Garrafa Térmica 750ml', preco: 50 },
} as const;

export type Produto = (typeof PRODUTOS)[keyof typeof PRODUTOS];

export const CUPONS = {
  BEMVINDO10: 'BEMVINDO10',
  EXPIRADO: 'VERAO2026',
  INEXISTENTE: 'CUPOMFAKE',
} as const;

export const MENSAGENS = {
  CUPOM_APLICADO: 'Cupom aplicado: 10% de desconto nos produtos.',
  CUPOM_INVALIDO: 'Cupom inválido.',
  CUPOM_EXPIRADO: 'Cupom expirado.',
  NOME_INVALIDO: 'Informe nome e sobrenome.',
  EMAIL_INVALIDO: 'Informe um e-mail válido.',
  CEP_INVALIDO: 'Informe um CEP com 8 dígitos.',
} as const;

export const REGRAS = {
  QUANTIDADE_MAXIMA: 5,
} as const;

export interface Cliente {
  nome: string;
  email: string;
  cep: string;
}

export const CLIENTE_VALIDO: Cliente = {
  nome: 'Maria Silva',
  email: 'maria@exemplo.com',
  cep: '01310-100',
};
