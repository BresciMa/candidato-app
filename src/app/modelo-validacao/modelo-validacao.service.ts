import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface ModeloValidacao {
  ModeloValidacao: string;
  Descricao: string;
  Prompt: string;
  idModeloValidacao: number;

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
        idModeloValidacao: item.IdModeloValidacao,
        ModeloValidacao: item.ModeloValidacao,
        Descricao: item.Descricao,
        Prompt: item.Prompt
      })))
    );
  }

  removerModelo(id: string): Observable<any> {
<<<<<<< HEAD
    console.log('Removendo modelo com ID:', id);
=======
>>>>>>> 92f7b63f6be3aa053aee208d292611a2cbc06391
    return this.http.patch(`${this.backendUrl}/${id}`, null);
  }

  criarModelo(modelo: ModeloValidacao): Observable<any> {
    return this.http.post(this.backendUrl, {
      Descricao: modelo.Descricao,
      Prompt: modelo.Prompt,
      ModeloValidacao: modelo.ModeloValidacao
    });
  }

  atualizarModelo(modelo: ModeloValidacao): Observable<any> {
    const chave = String(modelo.idModeloValidacao);
    delete modelo.idModeloValidacao;
    return this.http.put(`${this.backendUrl}/${chave}`, {
      Descricao: modelo.Descricao,
      Prompt: modelo.Prompt
    });
  }

  salvarModelo(modelo: ModeloValidacao): Observable<any> {
    // Aqui você monta o objeto sem o ID
    const payload = {
      ModeloValidacao: modelo.ModeloValidacao,
      Descricao: modelo.Descricao,
      Prompt: modelo.Prompt
    };
    console.log('Salvando modelo:', payload);
    return this.http.post(this.backendUrl, payload);
  }
}
