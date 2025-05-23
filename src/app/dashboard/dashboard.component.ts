import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface TempoExperiencia {
  Perfil: string;
  Experiencia: string;
}

interface FaixaSalarial {
  Perfil: string;
  Salario: string;
}

interface Padronizacoes {
  TempoExperiencia: TempoExperiencia[];
  FaixaSalarial: FaixaSalarial[];
}

interface VagaPerfil {
  descricao: string;
  requisito: string;
  idPerfilVaga: string;
}

interface ModeloAnalise {
  idModelo: string;
  descricao: string;
  prompt: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  form: FormGroup;
  conteudoArquivo = '';
  vagaPerfis: VagaPerfil[] = [];
  analiseModelos: ModeloAnalise[] = [];
  padronizacoes: Padronizacoes = { TempoExperiencia: [], FaixaSalarial: [] };

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      perfilVaga: ['', Validators.required],
      salarioPedido: ['', Validators.required],
      modeloAnalise: [null, Validators.required], // <-- Agora armazena o objeto inteiro
      transcricaoArquivo: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadPerfisEPadronizacoes();
    this.loadModelosAnalise();
  }

  private loadPerfisEPadronizacoes(): void {
    this.http.get<any>('/api/backend.php').subscribe({
      next: data => {
        this.vagaPerfis = this.mapVagaPerfis(data.PerfilVaga);
        this.padronizacoes = {
          TempoExperiencia: data.Padronizacoes.TempoExperiencia,
          FaixaSalarial: data.Padronizacoes.FaixaSalarial
        };
      },
      error: err => console.error('Erro ao carregar perfis e padronizações:', err)
    });
  }

  private loadModelosAnalise(): void {
    this.http.get<any>('/api/backend.php').subscribe({
      next: data => {
        this.analiseModelos = this.mapModelosAnalise(data.ModeloDeValidacao);
      },
      error: err => console.error('Erro ao carregar modelos de análise:', err)
    });
  }

  private mapVagaPerfis(rawPerfis: any[]): VagaPerfil[] {
    return rawPerfis.map(perfil => ({
      descricao: perfil.Descricao,
      requisito: perfil.Requisitos,
      idPerfilVaga: perfil.IdPerfilVaga // <-- Ajuste aqui: deve bater com o backend
    }));
  }

  private mapModelosAnalise(rawModelos: any[]): ModeloAnalise[] {
    return rawModelos.map(modelo => ({
      idModelo: modelo.IdModelo, // <-- Ajuste aqui: deve bater com o backend
      descricao: modelo.Descricao,
      prompt: modelo.Prompt
    }));
  }

  get formValido() {
    return this.form.valid;
  }

  triggerFileInput() {
    document.querySelector<HTMLInputElement>('input[type="file"]')?.click();
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      if (file.type !== 'text/plain') {
        alert('Por favor, selecione um arquivo .txt');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.conteudoArquivo = reader.result as string;
        this.form.patchValue({ transcricaoArquivo: file });
      };
      reader.readAsText(file);
    }
  }

  private detectarTipoPerfil(descricao: string): string {
    const desc = descricao.toLowerCase();
    if (desc.includes('jr')) return 'Junior';
    if (desc.includes('pl')) return 'Pleno';
    if (desc.includes('sr')) return 'Senior';
    return '';
  }

  private buscarExperienciaEsperada(tipoPerfil: string): string {
    if (!tipoPerfil) return 'Não encontrado';
    return this.padronizacoes.TempoExperiencia.find(
      t => t.Perfil.toLowerCase() === tipoPerfil.toLowerCase()
    )?.Experiencia ?? 'Não encontrado';
  }

  private buscarFaixaSalarialEsperada(tipoPerfil: string): string {
    if (!tipoPerfil) return 'Não encontrado';
    return this.padronizacoes.FaixaSalarial.find(
      f => f.Perfil.toLowerCase() === tipoPerfil.toLowerCase()
    )?.Salario ?? 'Não encontrado';
  }

  enviarAnalise() {
    if (!this.form.valid) {
      alert('Preencha todos os campos e selecione um arquivo válido.');
      return;
    }

    const formData = new FormData();

    const perfilDescricao = this.form.value.perfilVaga;
    const perfilSelecionado = this.vagaPerfis.find(p => p.descricao === perfilDescricao);
    const tipoPerfil = this.detectarTipoPerfil(perfilDescricao);
    const idPerfilVaga = perfilSelecionado?.idPerfilVaga ?? '';
    const modeloSelecionado: ModeloAnalise = this.form.value.modeloAnalise;

    const salarioPedido = this.form.value.salarioPedido;
    const experienciaEsperada = this.buscarExperienciaEsperada(tipoPerfil);
    const faixaSalarialEsperada = this.buscarFaixaSalarialEsperada(tipoPerfil);

    formData.append('perfilDescricao', perfilDescricao);
    formData.append('tipoPerfil', tipoPerfil);
    formData.append('requisitoPerfil', perfilSelecionado?.requisito ?? '');
    formData.append('idPerfilVaga', idPerfilVaga);

    formData.append('modeloDescricao', modeloSelecionado.descricao);
    formData.append('promptModelo', modeloSelecionado.prompt);
    formData.append('idModelo', modeloSelecionado.idModelo);

    formData.append('salarioPedido', salarioPedido);
    formData.append('experienciaEsperada', experienciaEsperada);
    formData.append('faixaSalarialEsperada', faixaSalarialEsperada);

    const arquivo = this.form.get('transcricaoArquivo')?.value;
    if (arquivo) {
      formData.append('cvFile', arquivo, arquivo.name);
      formData.append('transcricaoentrevista', arquivo, arquivo.name);
    } else {
      alert('Selecione um arquivo válido');
      return;
    }

    for (const [key, value] of (formData as any).entries()) {
      console.log(`${key}:`, value);
    }

    this.http.post('/api/analise.php', formData, { responseType: 'text' })
      .subscribe({
        next: (res) => {
          console.log('Resposta recebida:', res);
          alert('Análise enviada com sucesso!');
        },
        error: (err) => {
          console.error('Erro ao enviar análise:', err);
          alert(`Erro ao enviar análise: ${err.status} - ${err.statusText}\n${err.message}`);
        }
      });
  }
}