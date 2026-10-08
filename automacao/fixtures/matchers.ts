import { APIResponse, expect as baseExpect } from '@playwright/test';
import { isDeepStrictEqual } from 'node:util';

type ErroEsperado = {
  status: number;
  codigo: string;
  campo?: string;
  mensagem?: string;
};

/**
 * Matchers da API da Verzel Store.
 *
 * toBeErroDaApi valida status HTTP, código do erro e, quando informados, campo e mensagem.
 * Também garante o formato padrão { erro: { codigo, mensagem } } descrito na documentação.
 */
export const expect = baseExpect.extend({
  async toBeErroDaApi(resposta: APIResponse, esperado: ErroEsperado) {
    const nome = 'toBeErroDaApi';
    const corpo = await resposta.json().catch(() => undefined);
    const erro = corpo?.erro;

    const recebido: Partial<ErroEsperado> = { status: resposta.status(), codigo: erro?.codigo };
    if (esperado.campo !== undefined) recebido.campo = erro?.campo;
    if (esperado.mensagem !== undefined) recebido.mensagem = erro?.mensagem;

    const formatoValido = typeof erro?.mensagem === 'string';
    const pass = formatoValido && isDeepStrictEqual({ ...esperado }, recebido);

    return {
      name: nome,
      pass,
      expected: esperado,
      actual: recebido,
      message: () =>
        `${this.utils.matcherHint(nome, undefined, undefined, { isNot: this.isNot })}\n\n` +
        `Esperado: ${this.utils.printExpected(esperado)}\n` +
        `Recebido: ${this.utils.printReceived(recebido)}\n` +
        (formatoValido ? '' : 'O corpo não segue o formato { erro: { codigo, mensagem } }.\n') +
        `Corpo:    ${JSON.stringify(corpo)}`,
    };
  },
});
