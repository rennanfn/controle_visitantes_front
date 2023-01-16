import { SafeResourceUrl } from '@angular/platform-browser';
import { AgendamentoInterface } from 'src/app/service/agendamento/agendamento.service';

export class Agendamento {
  cod_agendamento?: number;
  visitante?: string;
  data?: string;
  hora?: string;
  observacao?: string;
  status?: string;
  data_criacao?: Date;
  usuario_criacao?: number;
  urlSafe?: SafeResourceUrl;
}

export interface dataDetalhesAgendamento {
  add_agendamento: boolean;
  detalhes: AgendamentoInterface;
}

export interface RetornoPadrao {
  erro: number;
  mensagem: string;
}

export interface Rertorno {
  retorno: RetornoPadrao;
}
