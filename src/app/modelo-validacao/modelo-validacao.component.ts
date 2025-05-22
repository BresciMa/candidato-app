import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModeloValidacao, ModeloValidacaoService } from './modelo-validacao.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modelo-validacao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modelo-validacao.component.html',
  styleUrls: ['./modelo-validacao.component.css'],
})
export class ModeloValidacaoComponent implements OnInit {
  modelo: ModeloValidacao[] = [];
  novoModelo: ModeloValidacao = { Descricao: '', Prompt: '', idModelo: '' };
  idModelosDisponiveis: string[] = [];
  editandoModelo: ModeloValidacao | null = null;
  novaDescricao: string = '';
  novosPrompts: string = '';
  novoIdModelo: string = '';

  constructor(private ModeloValidacaoService: ModeloValidacaoService) {}

  ngOnInit(): void {
    this.carregarModelos();
  }
  carregarModelos() {
    this.ModeloValidacaoService.listarModelos().subscribe({
      next: (data) => this.modelo = data,
      error: (err) => console.error('Erro ao carregar modelos', err)
    });
  }

  adicionarModelo() {

    this.modelo.push({
      idModelo: this.novoIdModelo,
      Descricao: this.novaDescricao,
      Prompt: this.novosPrompts
    });
    this.novoModelo = { Descricao: '', Prompt: '', idModelo: '' };
    this.salvar();
    this.novosPrompts = ''; // limpa o campo após adicionar
    this.novaDescricao = '';
    this.novoIdModelo = '';
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
