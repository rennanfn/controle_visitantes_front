import { TOKEN_STORAGE } from './../../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor(private jwtHelper: JwtHelperService) {}

  get token() {
    return localStorage.getItem(TOKEN_STORAGE) ?? '';
  }

  set token(token: string) {
    localStorage.setItem(TOKEN_STORAGE, token);
  }

  isExpiredToken(): boolean {
    return this.jwtHelper.isTokenExpired(this.token);
  }

  removeToken(): void {
    localStorage.removeItem(TOKEN_STORAGE);
  }
}
