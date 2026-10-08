/** Arredonda para 2 casas decimais (CA11). */
const arredondar = (valor: number): number => Math.round((valor + Number.EPSILON) * 100) / 100;

/** Formata um número como a loja exibe: 1234.5 -> "R$ 1.234,50". */
export const brl = (valor: number): string =>
  'R$ ' +
  arredondar(valor)
    .toFixed(2)
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
