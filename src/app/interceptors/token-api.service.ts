import { ToastrService } from 'ngx-toastr';
import { TokenService } from './../service/token/token.service';
import { AutenticacaoService } from 'src/app/service/auth/autenticacao.service';
import { catchError, switchMap } from 'rxjs/operators';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TokenApiService implements HttpInterceptor {
  constructor(
    private auth: AutenticacaoService,
    private tokenService: TokenService,
    private router: Router,
    private toast: ToastrService
  ) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    /* Tabela Http Error
    401: Token Invalido
    403: forbiden
    404: not found
    405: Method Not Allowed
    406: Not Accept

    // Custom Error
    450: Sem permissão por alteração de permissões do usuario
    */

    // Valida se existe token e se ele esta valido !
    if (!this.auth.isUserNotAutenticated()) {
      return next.handle(this.addToken(req, this.tokenService.token)).pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          if (errorResponse.status === 401) {
            this.toast.error('Sessão Expirada. Realize o Login novamente');
            this.router.navigate(['/login']);
          } else if (errorResponse.status === 403) {
            this.matarSessao(errorResponse);
          } else if (
            errorResponse.status === 450 &&
            typeof errorResponse.error.retorno.token !== undefined
            // Não tratado no backend
          ) {
            return throwError(errorResponse);
          }
          return throwError(errorResponse);
        })
      );
    }
    // Caso não esteja autenticado e o erro for de não autorizado 401
    return next.handle(req).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        if (errorResponse.status === 401) {
          //refresh token só é valido se o usuario estiver logado.
        } else if (errorResponse.status === 403) {
          this.matarSessao(errorResponse);
        } else if (
          errorResponse.status === 450 &&
          typeof errorResponse.error.retorno.token !== undefined
        ) {
          // Não tratado no backend
          return throwError(errorResponse);
        }
        return throwError(errorResponse);
      })
    );
  }

  // Adiciona Token no Header da Requisição
  private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({ setHeaders: { Authorization: `${token}` } });
  }

  // Ação de não autorizado ou forbidden
  private matarSessao({ error }): void {
    this.tokenService.removeToken();
    this.toast.error(error.retorno.mensagem);
    this.router.navigate(['/login']);
  }
}
