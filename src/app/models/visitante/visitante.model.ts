import { VisitanteInterface } from './../../service/visitante/visitante.service';
import { SafeResourceUrl } from '@angular/platform-browser';

export class Visitante {
  cod_visitante?: number;
  nome?: string;
  rg?: string;
  empresa?: string;
  foto?: Blob;
  data_criacao?: Date;
  usuario_criacao?: string;
  urlSafe?: SafeResourceUrl;
}

export class CadUsuario {
  cod_usuario!: string;
}

export interface dataDetalhesVisitante {
  add_visitante: boolean;
  detalhes: VisitanteInterface;
}

export interface RetornoPadrao {
  erro: number;
  mensagem: string;
}

export interface Rertorno {
  retorno: RetornoPadrao;
}

export interface VisitanteSelecionado {
  cod_visitante: string;
}
