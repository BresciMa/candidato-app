import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CandidatoService, VagaPerfil, Ferramenta } from './candidato.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-candidato',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [CandidatoService],
  templateUrl: './candidato.component.html',
  styleUrls: ['./candidato.component.css']
})
export class CandidatoComponent implements OnInit {
  form: FormGroup;
  vagaPerfis: VagaPerfil[] = [];
  ferramentas: Ferramenta[] = [];
  isLoading = false;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('fileCurriculo') fileCurriculo!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private candidatoService: CandidatoService,
    private router: Router
  ) {
    this.form = this.fb.group({
      perfilVaga: ['', Validators.required],
      ferramenta: [null, Validators.required],
      curriculoArquivo: [null, Validators.required],
      dadosAdicionais: ['']  // <- Adicionado aqui (opcional, sem validators)
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.candidatoService.carregarDadosBackend().subscribe({
      next: data => {
        this.vagaPerfis = data.vagaPerfis;
        this.ferramentas = data.ferramentas;
        this.isLoading = false;
      },
      error: err => {
        console.error('Erro ao carregar dados:', err);
        this.isLoading = false;
      }
    });
  }

  triggerFileInput(tipo: 'curriculoArquivo') {
    if (tipo === 'curriculoArquivo') {
      this.fileCurriculo.nativeElement.click();
    }
  }

  onFileSelected(event: Event, tipo: 'curriculoArquivo') {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.form.get(tipo)?.setValue(file);
      this.form.get(tipo)?.markAsDirty();
      this.form.get(tipo)?.updateValueAndValidity();
    }
  }


  enviarAnalise() {
    if (!this.form.valid) {
      alert('Preencha todos os campos e selecione os arquivos.');
      return;
    }

    const formData = new FormData();

    const perfilDescricao = this.form.value.perfilVaga;
    const perfilSelecionado = this.vagaPerfis.find(p => p.descricao === perfilDescricao);
    const idPerfilVaga = perfilSelecionado?.idPerfilVaga ?? '';
    const ferramentaSelecionada: Ferramenta = this.form.value.ferramenta;
    const dadosAdicionais = this.form.value.dadosAdicionais || '';

    formData.append('perfilVaga', idPerfilVaga);

    formData.append('ferramenta', ferramentaSelecionada.idFerramenta);

    formData.append('cvFile', this.form.value.curriculoArquivo, this.form.value.curriculoArquivo.name);
    formData.append('dadosAdicionais', dadosAdicionais);

    this.isLoading = true;
    this.candidatoService.enviarAnalise(formData).subscribe({
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
