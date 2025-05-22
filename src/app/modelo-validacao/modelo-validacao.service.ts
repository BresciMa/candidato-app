import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface ModeloValidacao {
  Descricao: string;
  Prompt: string;
  idModelo: string;
}

@Injectable({
  providedIn: 'root',
})
export class ModeloValidacaoService {
   private readonly backendUrl = '/api/whatsapp/candidatos/backend.php';
   private readonly analiseUrl = '/api/whatsapp/candidatos/analise.php';

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

  salvarModelos(modelos: ModeloValidacao[]): Observable<any> {
    return this.http.post(this.analiseUrl, { ModeloDeValidacao: modelos }, { responseType: 'text' });
  }
}
