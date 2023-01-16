import {
  Visitante,
  VisitanteSelecionado,
} from './../../models/visitante/visitante.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface VisitanteInterface {
  cod_visitante: number;
  nome: string;
  rg: string;
  empresa: string;
  foto: Blob;
  data_criacao: Date;
  usuario_criacao: string;
}

export interface VisitanteResponseInterface {
  msg: string;
}

@Injectable({
  providedIn: 'root',
})
export class VisitanteService {
  constructor(private http: HttpClient) {}

  cadastroVisitante(
    data: VisitanteInterface
  ): Observable<VisitanteResponseInterface> {
    const url = `${environment.NODE_API}/cadVisitante`;
    return this.http.post<VisitanteResponseInterface>(url, data);
  }

  buscaVisitante(): Observable<VisitanteInterface[]> {
    const url = `${environment.NODE_API}/cadVisitante`;
    return this.http.get<VisitanteInterface[]>(url);
  }

  updateVisitante(
    data: VisitanteInterface
  ): Observable<VisitanteResponseInterface> {
    const url = `${environment.NODE_API}/cadVisitante`;
    return this.http.put<VisitanteResponseInterface>(url, data);
  }

  detalhesVisitante(cod_visitante: number): Observable<VisitanteInterface[]> {
    const url = `${environment.NODE_API}/cadVisitante/${cod_visitante}`;
    return this.http.get<VisitanteInterface[]>(url);
  }

  visitanteSelecao(cod_visitante: number): Observable<VisitanteSelecionado> {
    const url = `${environment.NODE_API}/cadVisitante/${cod_visitante}`;
    return this.http.get<VisitanteSelecionado>(url);
  }
}
