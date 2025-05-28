import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

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

  constructor(private http: HttpClient) { }

  carregarDadosBackend(): Observable<{
    vagaPerfis: VagaPerfil[];
    padronizacoes: Padronizacoes;
    modelosAnalise: ModeloAnalise[];
  }> {
    return this.http.get<any>('/backend/backend.php').pipe(
      map(data => ({
        vagaPerfis: this.mapVagaPerfis(data.PerfilVaga),
        padronizacoes: {
          TempoExperiencia: data.Padronizacoes.TempoExperiencia,
          FaixaSalarial: data.Padronizacoes.FaixaSalarial
        },
        modelosAnalise: this.mapModelosAnalise(data.ModeloDeValidacao)
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
