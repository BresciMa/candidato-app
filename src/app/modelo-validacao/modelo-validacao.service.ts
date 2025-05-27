import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Modelo } from './modelo.model';

export interface ModeloValidacao {
  Descricao: string;
  Prompt: string;
  idModelo: string;
}

@Injectable({
  providedIn: 'root',
})
export class ModeloValidacaoService {
   private readonly backendUrl = '/api/backend.php';
   private readonly analiseUrl = '/api/analise.php';

  constructor(private http: HttpClient) {}

  listarModelos(): Observable<ModeloValidacao[]> {
    return this.http.get<any>(this.backendUrl).pipe(
      map(res => res.ModeloDeValidacao.map((item: any) => ({
        idModelo: item.IdModelo,   // Faz o mapeamento correto
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
