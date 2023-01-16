import { RetornoPadrao } from './../../models/visitante/visitante.model';
import { environment } from './../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface AgendamentoInterface {
  cod_agendamento: number;
  visitante: string;
  data: string;
  hora: string;
  observacao: string;
  status: number;
  data_criacao: Date;
  usuario_criacao: number;
}

export interface AgendamentoResponseInterface {
  msg: string;
}

@Injectable({
  providedIn: 'root',
})
export class AgendamentoService {
  constructor(private http: HttpClient) {}

  salvarAgendamento(
    data: AgendamentoInterface
  ): Observable<AgendamentoResponseInterface> {
    const url = `${environment.NODE_API}/cadAgendamento`;
    return this.http.post<AgendamentoResponseInterface>(url, data);
  }

  listarAgendamento(): Observable<AgendamentoInterface[]> {
    const url = `${environment.NODE_API}/cadAgendamento`;
    return this.http.get<AgendamentoInterface[]>(url);
  }

  detalhesAgendamento(
    cod_agendamento: number
  ): Observable<AgendamentoInterface[]> {
    const url = `${environment.NODE_API}/cadAgendamento/${cod_agendamento}`;
    return this.http.get<AgendamentoInterface[]>(url);
  }

  updateAgendamento(
    data: AgendamentoInterface
  ): Observable<AgendamentoResponseInterface> {
    const url = `${environment.NODE_API}/cadAgendamento`;
    return this.http.put<AgendamentoResponseInterface>(url, data);
  }

  delete(cod_agendamento: number): Observable<{ retorno: RetornoPadrao }> {
    const url = `${environment.NODE_API}/cadAgendamento/${cod_agendamento}`;
    return this.http.delete<{ retorno: RetornoPadrao }>(url);
  }
}
