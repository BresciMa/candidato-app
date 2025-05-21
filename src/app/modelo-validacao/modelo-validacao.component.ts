import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModeloValidacao, ModeloValidacaoService } from './modelo-validacao.service';
import { FormsModule } from '@angular/forms';
import { Modelo } from './modelo.model';

@Component({
  selector: 'app-perfil-vaga',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modelo-validacao.component.html',
  styleUrls: ['./modelo-validacao.component.css'],
})
export class ModeloValidacaoComponent implements OnInit {
  modelo: ModeloValidacao[] = [];
  novoModelo: ModeloValidacao = { Descricao: '', Prompt: '' };
  editandoModelo: ModeloValidacao | null = null;
  novaDescricao: string = '';
  novosPrompts: string = '';

  constructor(private ModeloValidacaoService: ModeloValidacaoService) {}

  ngOnInit(): void {
    this.carregarModelos();
  }

 carregarModelos() {
    this.ModeloValidacaoService.listarModelos().subscribe({
      next: (data) => this.modelo = data,
      error: (err) => console.error('Erro ao carregar Modelos', err)
    });
  }

  adicionarModelo() {
    this.modelo.push({ ...this.novoModelo });
    this.novoModelo = { Descricao: '', Prompt: '' };
    this.salvar();
    this.novosPrompts = ''; // limpa o campo após adicionar
  }

  removerModelo(index: number) {
    this.modelo.splice(index, 1);
    this.salvar();
  }

  salvar() {
    this.ModeloValidacaoService.salvarModelos(this.modelo).subscribe({
      next: () => console.log('Modelos salvos com sucesso'),
      error: (err) => console.error('Erro ao salvar modelos', err)
    });
  }
}
