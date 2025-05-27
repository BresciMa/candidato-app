import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModeloValidacao, ModeloValidacaoService } from './modelo-validacao.service';
import { ActivatedRoute, RouterModule, Router  } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modelo-validacao',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './modelo-validacao.component.html',
  styleUrls: ['./modelo-validacao.component.css'],
})
export class ModeloValidacaoComponent implements OnInit {
  modelos: ModeloValidacao[] = [];
  novoModelo: ModeloValidacao = { Descricao: '', Prompt: '', idModelo: '' };
  idModelosDisponiveis: string[] = [];
  editandoModelo: ModeloValidacao | null = null;
  novaDescricao: string = '';
  novosPrompts: string = '';
  novoIdModelo: string = '';
  modoEdicao: boolean = false;

  constructor(private ModeloValidacaoService: ModeloValidacaoService,
    private router: Router,
    private route: ActivatedRoute) { }

  editarModelo(modelo: ModeloValidacao) {
    this.modoEdicao = true;
    this.router.navigate(['/home/modelo-validacao/editar', modelo.idModelo], {
      state: { modelo }
    });
  }

    ngOnInit(): void {
    this.carregarModelos();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modoEdicao = true;
      this.ModeloValidacaoService.listarModelos().subscribe({
        next: (data) => {
          const encontrado = data.find(p => p.idModelo === id);
          if (encontrado) {
            this.novoModelo = { ...encontrado };
          } else {
            alert('Modelo não encontrado!');
            this.router.navigate(['/home/modelo-validacao']);
          }
        },
        error: (err) => console.error('Erro ao carregar modelo', err)
      });
    }
  }

  carregarModelos() {
    this.ModeloValidacaoService.listarModelos().subscribe({
      next: (data) => this.modelos = data,
      error: (err) => console.error('Erro ao carregar modelos', err)
    });
  }

  adicionarModelo() {
    this.novoModelo = { Descricao: '', Prompt: '', idModelo: '' };
    this.modoEdicao = false;  // Define como inclusão
    this.modelos.push({ ...this.novoModelo });
    this.salvar();
  }

  removerModelo(id: string): void {
    if (confirm('Tem certeza que deseja remover este Modelo?')) {
      this.ModeloValidacaoService.removerModelo(id).subscribe({
        next: () => {
          alert('Modelo removido com sucesso!');
          this.carregarModelos(); // Refresh the list
        },
        error: (err) => console.error('Erro ao remover modelo', err)
      });
    }
  }

  salvar() {
    this.ModeloValidacaoService.salvarModelos([this.novoModelo]).subscribe({
      next: () => {
        alert('Modelo salvo com sucesso!');
        this.router.navigate(['/home/modelo-validacao']);
      },
      error: (err) => console.error('Erro ao salvar modelo', err)
    });
  }
}
