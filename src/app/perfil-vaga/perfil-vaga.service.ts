import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface PerfilVaga {
  Descricao: string;
  Requisitos: string;
  IdPerfilVaga: string;
}

@Injectable({
  providedIn: 'root',
})
export class PerfilVagaService {
   private readonly backendUrl = '/api/backend.php';
   private readonly analiseUrl = '/api/analise.php';

  constructor(private http: HttpClient) {}

  listarPerfis(): Observable<PerfilVaga[]> {
    return this.http.get<any>(this.backendUrl).pipe(
      map(res => res.PerfilVaga.map((item: any) => ({
        IdPerfilVaga: item.IdPerfilVaga,   // Faz o mapeamento correto
        Descricao: item.Descricao,
        Requisitos: item.Requisitos
      })))
    );
  }

  removerPerfil(id: string): Observable<any> {
    return this.http.delete(`${this.analiseUrl}?id=${id}`);
  }

  criarPerfil(perfil: PerfilVaga): Observable<any> {
    return this.http.post(this.analiseUrl, {
      action: 'create',
      PerfilVaga: perfil
    });
  }

  atualizarPerfil(perfil: PerfilVaga): Observable<any> {
    return this.http.put(`${this.analiseUrl}?id=${perfil.IdPerfilVaga}`, {
      action: 'update',
      PerfilVaga: perfil
    });
  }

  salvarPerfis(perfis: PerfilVaga[]): Observable<any> {
    return this.http.post(this.analiseUrl, { PerfilVaga: perfis }, { responseType: 'text' });
  }
}
