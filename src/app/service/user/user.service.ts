import { Injectable } from '@angular/core';
import { User } from 'src/app/models/autenticacao/user.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  CRYPTO,
  environment,
  TOKEN_STORAGE,
} from './../../../environments/environment';
import { CryptoService } from '../crypto-service/crypto.service';

export interface UsuarioInterface {
  cod_usuario: number;
  usuario: string;
  senha: string;
}

export interface UsuarioResponseInterface {
  msg: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public usuario$ = new BehaviorSubject<User>(this.usuario);

  constructor(private http: HttpClient, private crypto: CryptoService) {
    this.setUsuario(this.usuario);
  }

  setUsuario(usuario: User) {
    this.usuario$.next(usuario);
  }

  get usuario(): User {
    const token = localStorage.getItem(TOKEN_STORAGE);
    if (typeof token === 'undefined' || token === null || token.length <= 0)
      return {} as User;

    const decodedToken = this.crypto.decodeToken(token, CRYPTO.key);
    if (typeof decodedToken === 'undefined') return {} as User;
    return decodedToken;
  }

  getError(err): string {
    let msg = '';
    if (err.message !== undefined) {
      msg = err.message;
    } else if (err.error.retorno !== undefined) {
      msg = err.error.retorno.mensagem;
    } else {
      msg = 'Tente novamente mais tarde, serviço indisponível no momento!';
    }
    return msg;
  }

  cadastroUsuario(
    data: UsuarioInterface
  ): Observable<UsuarioResponseInterface> {
    const url = `${environment.NODE_API}/cadUsuario`;
    return this.http.post<UsuarioResponseInterface>(url, data);
  }
}
