import { Component, ElementRef, ViewChild, ApplicationConfig } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, provideHttpClient } from '@angular/common/http';

interface VagaPerfil {
  descricao: string;
  requisito: string;
}

interface ModeloAnalise {
  descricao: string;
  prompt: string;
}

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

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient()]
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [FormBuilder],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  form: FormGroup;
  vagaPerfis: VagaPerfil[] = [];
  analiseModelos: ModeloAnalise[] = [];
  padronizacoes: Padronizacoes = { TempoExperiencia: [], FaixaSalarial: [] };
  conteudoArquivo = '';

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.form = this.createForm();
  }

  /** Cria o form reativo com validações */
  private createForm(): FormGroup {
    return this.fb.group({
      perfilVaga: ['', Validators.required],
      salarioPedido: ['', Validators.required],
      modeloAnalise: ['', Validators.required]
    });
  }

  /** Carrega os dados iniciais necessários (perfis, modelos e padronizações) */
  ngOnInit(): void {
    this.loadPerfisEPadronizacoes();
    this.loadModelosAnalise();
  }

  /** Carrega perfis e padronizações da API */
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

  /** Carrega modelos de análise da API */
  private loadModelosAnalise(): void {
    this.http.get<any>('/api/backend.php').subscribe({
      next: data => {
        this.analiseModelos = this.mapModelosAnalise(data.ModeloDeValidacao);
      },
      error: err => console.error('Erro ao carregar modelos de análise:', err)
    });
  }

  /** Mapeia dados da API para objetos do tipo VagaPerfil */
  private mapVagaPerfis(rawPerfis: any[]): VagaPerfil[] {
    return rawPerfis.map(perfil => ({
      descricao: perfil.Descricao,
      requisito: perfil.Requisitos
    }));
  }

  /** Mapeia dados da API para objetos do tipo ModeloAnalise */
  private mapModelosAnalise(rawModelos: any[]): ModeloAnalise[] {
    return rawModelos.map(modelo => ({
      descricao: modelo.Descricao,
      prompt: modelo.Prompt
    }));
  }

  /** Aciona o input file para selecionar arquivo */
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  /** Lida com seleção de arquivo txt */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = () => (this.conteudoArquivo = reader.result as string);
      reader.readAsText(file);
    } else {
      alert('Por favor, selecione um arquivo .txt válido');
      input.value = '';
    }
  }

  /** Formata campo salário para moeda BRL */
  formatCurrency(event: any): void {
    let valorApenasNumeros = event.target.value.replace(/\D/g, '');
    const valorFormatado = (Number(valorApenasNumeros) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
    this.form.get('salarioPedido')?.setValue(valorFormatado, { emitEvent: false });
  }

  /** Envia análise com todos os dados do formulário e arquivo */
  enviarAnalise(): void {
    if (!this.form.valid || !this.conteudoArquivo) {
      console.warn('Formulário inválido ou arquivo não carregado');
      return;
    }

    const perfilDescricao = this.form.value.perfilVaga;
    const modeloDescricao = this.form.value.modeloAnalise;
    const salarioPedido = this.form.value.salarioPedido;

    const perfilSelecionado = this.vagaPerfis.find(p => p.descricao === perfilDescricao);
    const modeloSelecionado = this.analiseModelos.find(m => m.descricao === modeloDescricao);

    const tipoPerfil = this.detectarTipoPerfil(perfilDescricao);

    const experienciaEsperada = this.buscarExperienciaEsperada(tipoPerfil);
    const faixaSalarialEsperada = this.buscarFaixaSalarialEsperada(tipoPerfil);

    const dadosAnalise = {
      perfil: {
        descricao: perfilDescricao,
        requisito: perfilSelecionado?.requisito ?? 'Não encontrado'
      },
      modelo: {
        descricao: modeloDescricao,
        prompt: modeloSelecionado?.prompt ?? 'Não encontrado'
      },
      salario: salarioPedido,
      conteudoArquivo: this.conteudoArquivo.substring(0, 100) + '...',
      experienciaEsperada,
      faixaSalarialEsperada
    };

    console.log('Dados para análise:', dadosAnalise);
  }

  /** Detecta tipo do perfil (Junior, Pleno, Senior) */
  private detectarTipoPerfil(descricao: string): string {
    const desc = descricao.toLowerCase();
    if (desc.includes('jr')) return 'Junior';
    if (desc.includes('pl')) return 'Pleno';
    if (desc.includes('sr')) return 'Senior';
    return '';
  }

  /** Busca experiência esperada pela padronização */
  private buscarExperienciaEsperada(tipoPerfil: string): string {
    if (!tipoPerfil) return 'Não encontrado';
    return this.padronizacoes.TempoExperiencia.find(
      t => t.Perfil.toLowerCase() === tipoPerfil.toLowerCase()
    )?.Experiencia ?? 'Não encontrado';
  }

  /** Busca faixa salarial esperada pela padronização */
  private buscarFaixaSalarialEsperada(tipoPerfil: string): string {
    if (!tipoPerfil) return 'Não encontrado';
    return this.padronizacoes.FaixaSalarial.find(
      f => f.Perfil.toLowerCase() === tipoPerfil.toLowerCase()
    )?.Salario ?? 'Não encontrado';
  }

  /** Indica se o formulário está válido e o arquivo carregado */
  get formValido(): boolean {
    return this.form.valid && !!this.conteudoArquivo;
  }
}