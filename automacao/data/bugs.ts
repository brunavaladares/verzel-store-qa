/**
 * Bugs encontrados na execução (detalhes em docs/bugs).
 *
 * Os testes que reproduzem um bug são declarados com `test.fail(...)` e recebem a anotação
 * correspondente: a suíte segue verde enquanto o bug existir e passa a acusar falha
 * assim que ele for corrigido, avisando que a marcação deve ser removida.
 */
export const BUGS = {
  FRETE_GRATIS_200: {
    type: 'bug',
    description: 'BUG-01 · Subtotal de exatamente R$ 200,00 não recebe frete grátis (CA06)',
  },
  QUANTIDADE_MAXIMA_API: {
    type: 'bug',
    description: 'BUG-02 · API aceita mais de 5 unidades do mesmo produto (CA10)',
  },
} as const;
