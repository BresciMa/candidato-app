import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxCurrencyDirective } from 'ngx-currency';
import { DashboardService, VagaPerfil, ModeloAnalise, Padronizacoes } from './dashboard.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxCurrencyDirective],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  form: FormGroup;
  vagaPerfis: VagaPerfil[] = [];
  analiseModelos: ModeloAnalise[] = [];
  padronizacoes: Padronizacoes = { TempoExperiencia: [], FaixaSalarial: [] };
  isLoading = false;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('fileCurriculo') fileCurriculo!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private dashboardService: DashboardService,
    private router: Router
  ) {
    this.form = this.fb.group({
      perfilVaga: ['', Validators.required],
      salarioPedido: ['', Validators.required],
      modeloAnalise: [null, Validators.required],
      transcricaoArquivo: [null, Validators.required],
      curriculoArquivo: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.dashboardService.carregarDadosBackend().subscribe({
      next: data => {
        this.vagaPerfis = data.vagaPerfis;
        this.analiseModelos = data.modelosAnalise;
        this.padronizacoes = data.padronizacoes;
        this.isLoading = false;
      },
      error: err => {
        console.error('Erro ao carregar dados:', err);
        this.isLoading = false;
      }
    });
  }

  triggerFileInput(tipo: 'transcricaoArquivo' | 'curriculoArquivo') {
    if (tipo === 'transcricaoArquivo') {
      this.fileInput.nativeElement.click();
    } else if (tipo === 'curriculoArquivo') {
      this.fileCurriculo.nativeElement.click();
    }
  }

  onFileSelected(event: Event, tipo: 'transcricaoArquivo' | 'curriculoArquivo') {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.form.get(tipo)?.setValue(file);
      this.form.get(tipo)?.markAsDirty();
      this.form.get(tipo)?.updateValueAndValidity();
    }
  }

  private detectarTipoPerfil(descricao: string): string {
    const desc = descricao.toLowerCase();
    if (desc.includes('jr') || desc.includes('junior')) return 'Junior';
    if (desc.includes('pl') || desc.includes('pleno')) return 'Pleno';
    if (desc.includes('sr') || desc.includes('senior')) return 'Senior';
    return 'Não identificado';
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
      alert('Preencha todos os campos e selecione os arquivos.');
      return;
    }

    const formData = new FormData();

    const perfilDescricao = this.form.value.perfilVaga;
    const perfilSelecionado = this.vagaPerfis.find(p => p.descricao === perfilDescricao);
    const tipoPerfil = this.detectarTipoPerfil(perfilDescricao);
    const idPerfilVaga = perfilSelecionado?.idPerfilVaga ?? '';
    const modeloSelecionado: ModeloAnalise = this.form.value.modeloAnalise;

    formData.append('perfilVaga', idPerfilVaga);

    formData.append('modeloDeValidacao', modeloSelecionado.idModelo);

    formData.append('transcricaoentrevista', this.form.value.transcricaoArquivo, this.form.value.transcricaoArquivo.name);
    formData.append('cvFile', this.form.value.curriculoArquivo, this.form.value.curriculoArquivo.name);

    this.isLoading = true;
    this.dashboardService.enviarAnalise(formData).subscribe({
      next: (res) => {
        this.isLoading = false;
        sessionStorage.setItem('resultadoAnalise', res);
        this.router.navigate(['/home/resultado-analise']);
      },
      error: (err) => {
        this.isLoading = false;
         console.error('Erro ao enviar análise:', err);
        alert(`Erro ao enviar análise: ${err.status} - ${err.statusText}\n${err.message}`);
      }
    });
  }
}
