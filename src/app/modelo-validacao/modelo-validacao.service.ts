import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface ModeloValidacao {
  Descricao: string;
  Prompt: string;
  idModelo: string;
}

@Injectable({
  providedIn: 'root'
})

export class ModeloValidacaoService {
private readonly backendUrl = '/api/modelo-validacao'

  constructor(private http: HttpClient) {}

  listarModelos(): Observable<ModeloValidacao[]> {
    return this.http.get<any[]>(this.backendUrl).pipe(
      map(res => res.map((item: any) => ({
        idModelo: item.ModeloValidacao,
        Descricao: item.Descricao,
        Prompt: item.Prompt
      })))
    );
  }

  removerModelo(id: string): Observable<any> {
    return this.http.delete(`${this.backendUrl}?id=${id}`);
  }

  criarModelo(modelo: ModeloValidacao): Observable<any> {
    return this.http.post(this.backendUrl, {
      Descricao: modelo.Descricao,
      Prompt: modelo.Prompt,
      ModeloValidacao: modelo.idModelo
    });
  }

  atualizarModelo(modelo: ModeloValidacao): Observable<any> {
    return this.http.put(`${this.backendUrl}?id=${modelo.idModelo}`, {
      Descricao: modelo.Descricao,
      Prompt: modelo.Prompt,
      ModeloValidacao: modelo.idModelo
    });
  }

  salvarModelos(modelos: ModeloValidacao[]): Observable<any> {
    return this.http.post(this.backendUrl, { ModeloValidacao: modelos }, { responseType: 'text' });
  }
}
