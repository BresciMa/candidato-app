import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, forkJoin } from 'rxjs';

export interface TempoExperiencia {
  Perfil: string;
  Experiencia: string;
}

export interface FaixaSalarial {
  Perfil: string;
  Salario: string;
}

export interface Padronizacoes {
  TempoExperiencia: TempoExperiencia[];
  FaixaSalarial: FaixaSalarial[];
}

export interface VagaPerfil {
  descricao: string;
  requisito: string;
  idPerfilVaga: string;
}

export interface ModeloAnalise {
  idModelo: string;
  descricao: string;
  prompt: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly perfilVagaUrl = '/api/perfil-vaga';
  private readonly modeloValidacaoUrl = '/api/modelo-validacao';

  constructor(private http: HttpClient) { }

  carregarDadosBackend(): Observable<{
    vagaPerfis: VagaPerfil[];
    padronizacoes: Padronizacoes;
    modelosAnalise: ModeloAnalise[];
  }> {
    return forkJoin({
      perfilVaga: this.http.get<any[]>(this.perfilVagaUrl),
      modeloValidacao: this.http.get<any[]>(this.modeloValidacaoUrl)
    }).pipe(
      map(data => ({
        vagaPerfis: this.mapVagaPerfis(data.perfilVaga),
        padronizacoes: {
          TempoExperiencia: data.perfilVaga.map(item => ({
            Perfil: item.Descricao,
            Experiencia: item.TempoExperiencia
          })),
          FaixaSalarial: data.perfilVaga.map(item => ({
            Perfil: item.Descricao,
            Salario: item.FaixaSalarial
          }))
        },
        modelosAnalise: this.mapModelosAnalise(data.modeloValidacao)
      }))
    );
  }

  enviarAnalise(formData: FormData): Observable<any> {
    return this.http.post('/api/api-ai-assistent.php', formData, { responseType: 'text' });
  }

  private mapVagaPerfis(rawPerfis: any[]): VagaPerfil[] {
    return rawPerfis.map(perfil => ({
      descricao: perfil.Descricao,
      requisito: perfil.Requisitos,
      idPerfilVaga: perfil.IdPerfilVaga
    }));
  }

  private mapModelosAnalise(rawModelos: any[]): ModeloAnalise[] {
    return rawModelos.map(modelo => ({
      idModelo: modelo.IdModelo,
      descricao: modelo.Descricao,
      prompt: modelo.Prompt
    }));
  }
}
