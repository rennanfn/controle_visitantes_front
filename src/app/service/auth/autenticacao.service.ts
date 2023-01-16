import { Router } from '@angular/router';
import { CRYPTO, environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/models/autenticacao/user.model';
import { TokenService } from '../token/token.service';
import { CryptoService } from '../crypto-service/crypto.service';
import { UserService } from '../user/user.service';
import { map } from 'rxjs/operators';

export interface LoginInterface {
  usuario: string;
  senha: string;
}

export interface LoginResponseInterface {
  msg: string;
}

@Injectable({
  providedIn: 'root',
})
export class AutenticacaoService {
  /*private _autenticado: BehaviorSubject<boolean>;
  public readonly autenticado$: Observable<boolean>;*/

  private _autenticado: BehaviorSubject<boolean>;
  public readonly autenticado$: Observable<boolean>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService,
    private cryptoService: CryptoService,
    private userService: UserService
  ) {
    this._autenticado = new BehaviorSubject<boolean>(false);
    this.autenticado$ = this._autenticado.asObservable();
  }

  public isUserNotAutenticated(): boolean {
    const token = this.tokenService.token;
    if (typeof token === 'undefined' || token === null || token.length <= 0) {
      return true;
    }
    // Se der erro na hora de decodificar e descriptografar o token
    // recusa o token.
    if (!this.canDecodeToken(token)) {
      this.stopSession();
      return true;
    }
    return !token;
  }

  private canDecodeToken(token: string): boolean {
    const decodedToken = this.cryptoService.decodeToken(token, CRYPTO.key);
    if (typeof decodedToken === 'undefined' || decodedToken === null)
      return false;
    return true;
  }

  validaUsuario(data: LoginInterface): Observable<any> {
    const url = `${environment.NODE_API}/login`;
    return this.http.post<any>(url, data).pipe(
      map(({ token }) => {
        if (!this.criarSessao(token)) {
          throw new Error('Falha ao criar sessão!');
        }
        return true;
      })
    );
  }

  deslogar() {
    this.router.navigate(['/login']);
    this.stopSession();
    return;
  }

  criarSessao(token: string) {
    try {
      const user: User = Object.assign(
        {},
        this.cryptoService.decodeToken(token, CRYPTO.key) as User
      );
      this.userService.setUsuario(user);
      this.tokenService.token = token;
      this._autenticado.next(true);

      return true;
    } catch (err) {
      return false;
    }
  }

  stopSession() {
    this.tokenService.removeToken();
    if (this._autenticado.value) {
      this._autenticado.next(false);
    }
  }
}
