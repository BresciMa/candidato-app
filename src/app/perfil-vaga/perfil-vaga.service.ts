import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface PerfilVaga {
  idPerfilVaga: number;
  PerfilVaga: string;
  Descricao: string;
  Requisitos: string;
}

@Injectable({
  providedIn: 'root'
})

export class PerfilVagaService {
<<<<<<< HEAD
   private readonly backendUrl = '/api/perfil-vaga';
=======
  private readonly backendUrl = '/api/perfil-vaga';
  private readonly analiseUrl = '/api/api-ai-assistent.php';
>>>>>>> 92f7b63f6be3aa053aee208d292611a2cbc06391

  constructor(private http: HttpClient) { }

  listarPerfis(): Observable<PerfilVaga[]> {
<<<<<<< HEAD
  return this.http.get<any>(this.backendUrl).pipe(
    map(res => res.map((item: any) => ({
      idPerfilVaga: item.IdPerfilVaga,
      PerfilVaga: item.PerfilVaga,
      Descricao: item.Descricao,
      Requisitos: item.Requisitos
    })))
  );
}

  removerPerfil(id: number): Observable<any> {
    return this.http.patch(`${this.backendUrl}/${id}`, null);
  }

criarPerfil(perfil: PerfilVaga): Observable<any> {
  delete perfil.idPerfilVaga; // Remove o ID para criar um novo perfil
  return this.http.post(this.backendUrl, perfil);
}
=======
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
>>>>>>> 92f7b63f6be3aa053aee208d292611a2cbc06391

  atualizarPerfil(perfil: PerfilVaga): Observable<any> {
    return this.http.put(`${this.backendUrl}/${String(perfil.idPerfilVaga)}`, {
      PerfilVaga: perfil.PerfilVaga,
      Descricao: perfil.Descricao,
      Requisitos: perfil.Requisitos
    });
  }

  salvarPerfis(perfis: PerfilVaga[]): Observable<any> {
    return this.http.post(this.backendUrl, { PerfilVaga: perfis }, { responseType: 'text' });
  }
}
