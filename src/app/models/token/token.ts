// import { Retorno, Mensagem } from '../retornos/retorno';

export class TokenApi {
  AutenticacaoRetornar!: DataTokenApi;
}

export interface DataTokenApi {
  sucesso?: string;
  acao?: string;
  token: string;
  listaMensagem?: Mensagem[];
}

export interface Mensagem {
  codigo: string;
  mensagem: string;
}
