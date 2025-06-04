import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, forkJoin } from 'rxjs';


export interface VagaPerfil {
  descricao: string;
  requisito: string;
  idPerfilVaga: string;
}

export interface Ferramenta {
  idFerramenta: string;
  descricao: string;
  Prompt: string; // Opcional, caso não seja necessário
}

@Injectable({
  providedIn: 'root'
})
export class CandidatoService {
  private readonly perfilVagaUrl = '/api/perfil-vaga';
  private readonly ferramentaUrl = '/api/modelo-validacao';

  constructor(private http: HttpClient) { }

  carregarDadosBackend(): Observable<{
    vagaPerfis: VagaPerfil[];
    ferramentas: Ferramenta[];
  }> {
    return forkJoin({
      perfilVaga: this.http.get<any[]>(this.perfilVagaUrl),
      ferramenta: this.http.get<any[]>(this.ferramentaUrl)
    }).pipe(
      map(data => ({
        vagaPerfis: this.mapVagaPerfis(data.perfilVaga),
        ferramentas: this.mapFerramentas(data.ferramenta)
      }))
    );
  }

  enviarAnalise(formData: FormData): Observable<any> {
    return this.http.post('/api/analise', formData, { responseType: 'text' }); // endpoint para analise ainda não implementada no backEnd
  }

  private mapVagaPerfis(rawPerfis: any[]): VagaPerfil[] {
    return rawPerfis.map(perfil => ({
      descricao: perfil.Descricao,
      requisito: perfil.Requisitos,
      idPerfilVaga: perfil.IdPerfilVaga
    }));
  }

  private mapFerramentas(rawFerramentas: any[]): Ferramenta[] {
    return rawFerramentas.map(ferramenta => ({
      idFerramenta: ferramenta.idModeloValidacao,
      descricao: ferramenta.Descricao,
      Prompt: ferramenta.Prompt || '' // Caso Prompt não seja obrigatório
    }));
  }
}
