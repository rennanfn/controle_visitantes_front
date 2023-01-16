import { Autorizacao } from '../autorizacao/autorizacao';

export class User {
  cod_usuario!: string;
  usuario!: string;
  senha!: string;
  autorizacoes!: Array<Autorizacao>;
}
