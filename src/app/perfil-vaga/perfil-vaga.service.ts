import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface PerfilVaga {
  Descricao: string;
  Requisitos: string;
  IdPerfilVaga: string;
}

@Injectable({
  providedIn: 'root'
})

export class PerfilVagaService {
  private readonly backendUrl = '/api/perfil-vaga';
  private readonly analiseUrl = '/api/api-ai-assistent.php';

  constructor(private http: HttpClient) { }

  listarPerfis(): Observable<PerfilVaga[]> {
    return this.http.get<any>(this.backendUrl).pipe(
      map(res => res.map((item: any) => ({
        IdPerfilVaga: item.IdPerfilVaga,
        Descricao: item.Descricao,
        Requisitos: item.Requisitos
      })))
    );
  }

  removerPerfil(id: string): Observable<any> {
    return this.http.patch(`${this.backendUrl}/${id}`, null);
  }

  criarPerfil(modelo: PerfilVaga): Observable<any> {
    return this.http.post(this.backendUrl, {
      Descricao: modelo.Descricao,
      Requisitos: modelo.Requisitos,
      PerfilVaga: modelo.IdPerfilVaga
    });
  }

  atualizarPerfil(perfil: PerfilVaga): Observable<any> {
    return this.http.put(`${this.analiseUrl}?id=${perfil.IdPerfilVaga}`, {
      IdPerfilVaga: perfil.IdPerfilVaga,
      Descricao: perfil.Descricao,
      Requisitos: perfil.Requisitos
    });
  }

  salvarPerfis(perfis: PerfilVaga[]): Observable<any> {
    return this.http.post(this.analiseUrl, { PerfilVaga: perfis }, { responseType: 'text' });
  }
}
