import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'usuario_logado';

  constructor() {}

  login(usuario: string, senha: string): boolean {
    if (usuario === 'admin' && senha === 'admin') {
      localStorage.setItem(this.TOKEN_KEY, 'true');
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem(this.TOKEN_KEY) === 'true';
  }
}