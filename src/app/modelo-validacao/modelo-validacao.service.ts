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
   private readonly apiUrl = '/api/modelo-validacao';
   private readonly analiseUrl = '/api/api-ai-assistent.php';

  constructor(private http: HttpClient) {}

  listarModelos(): Observable<ModeloValidacao[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(res => res.map((item: any) => ({
        idModelo: item.ModeloValidacao,
        Descricao: item.Descricao,
        Prompt: item.Prompt
      })))
    );
  }

  removerModelo(id: string): Observable<any> {
    return this.http.delete(`${this.analiseUrl}?id=${id}`);
  }

    criarModelo(modelo: ModeloValidacao): Observable<any> {
      return this.http.post(this.analiseUrl, {
        action: 'create',
        ModeloValidacao: modelo
      });
    }

  atualizarModelo(modelo: ModeloValidacao): Observable<any> {
    return this.http.put(`${this.analiseUrl}?id=${modelo.idModelo}`, {
      action: 'update',
      Modelo: modelo
    });
  }

  salvarModelos(modelos: ModeloValidacao[]): Observable<any> {
    return this.http.post(this.analiseUrl, { ModeloValidacao: modelos }, { responseType: 'text' });
  }
}
