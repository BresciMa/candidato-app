import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = '/api/auth';

  constructor(private http: HttpClient) {}

  login(usuario: string, senha: string): Observable<any> {
    const body = {
      username: usuario,
      password: senha,
    };

    return this.http.post<any>(`${this.apiUrl}/login`, body).pipe(
      tap((response) => {
        // Se desejar, armazene o token
        localStorage.setItem('token', response.token);
      })
    );
  }

/*  login(usuario: string, senha: string): Observable<any> {
    console.log('Tentando fazer login com:', usuario, senha);
      return this.http.post(`${this.apiUrl}/login`, {
        username: usuario,
        password: senha,
      });
    }*/

  logout() {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
