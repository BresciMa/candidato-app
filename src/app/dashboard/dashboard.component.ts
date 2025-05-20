import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  form: FormGroup;
  conteudoArquivo = '';
  vagaPerfis = [{ descricao: 'Desenvolvedor' }, { descricao: 'Analista' }];
  analiseModelos = [{ descricao: 'Modelo A' }, { descricao: 'Modelo B' }];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      perfilVaga: ['', Validators.required],
      salarioPedido: ['', Validators.required],
      modeloAnalise: ['', Validators.required],
      transcricaoArquivo: [null, Validators.required]
    });
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

  enviarAnalise() {
  if (!this.form.valid) {
    alert('Preencha todos os campos e selecione um arquivo válido.');
    return;
  }

  const formData = new FormData();

  formData.append('perfilVaga', this.form.value.perfilVaga);
  formData.append('salarioPedido', this.form.value.salarioPedido);
  formData.append('modeloAnalise', this.form.value.modeloAnalise);

  // Adiciona o arquivo do formulário (do campo transcricaoArquivo)
  const arquivo = this.form.get('transcricaoArquivo')?.value;
  if (arquivo) {
    formData.append('arquivo', arquivo, arquivo.name);
  } else {
    alert('Selecione um arquivo válido');
    return;
  }

  this.http.post('/api/whatsapp/candidatos/analise.php', formData, { responseType: 'text' })
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