import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModeloValidacao, ModeloValidacaoService } from './modelo-validacao.service';
import { ActivatedRoute, RouterModule, Router  } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modelo-validacao',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  providers: [ModeloValidacaoService],
  templateUrl: './modelo-validacao.component.html',
  styleUrls: ['./modelo-validacao.component.css'],
})

export class ModeloValidacaoComponent implements OnInit {
  modelos: ModeloValidacao[] = [];
  novoModelo: ModeloValidacao = { Descricao: '', Prompt: '', idModeloValidacao: 0, ModeloValidacao: '' };
  idModelosDisponiveis: string[] = [];
  editandoModelo: ModeloValidacao | null = null;
  novaDescricao: string = '';
  novosPrompts: string = '';
  novoIdModelo: string = '';
  modoEdicao: boolean = false;


  constructor(private ModeloValidacaoService: ModeloValidacaoService,
    private modeloValidacaoService: ModeloValidacaoService,
    private router: Router,
    private route: ActivatedRoute) { }

  editarModelo(modelo: ModeloValidacao) {
    console.log('Editando modelo:', modelo);
    this.modoEdicao = true;
    this.router.navigate(['/home/modelo-validacao/editar', modelo.idModeloValidacao], {
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
          const encontrado = data.find(p => p.idModeloValidacao === Number(id));
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
      next: (data) => {this.modelos = data; console.log('Modelos carregadosasasasa:', this.modelos[0]);},

      error: (err) => console.error('Erro ao carregar modelos', err)
    });
    console.log('Modelos carregadosasasasa:', this.modelos[0]);
  }

  adicionarModelo() {
    this.novoModelo = { Descricao: '', Prompt: '', idModeloValidacao: 0, ModeloValidacao: '' };
    this.modoEdicao = false;  // Define como inclusão
    this.modelos.push({ ...this.novoModelo });
    this.salvar();
  }

  removerModelo(id: number): void {
    if (confirm('Tem certeza que deseja remover este Modelo?')) {
      this.ModeloValidacaoService.removerModelo(String(id)).subscribe({
        next: () => {
          alert('Modelo removido com sucesso!');
          this.carregarModelos(); // Refresh the list
        },
        error: (err) => console.error('Erro ao remover modelo', err)
      });
    }
  }

  salvar() {
    if (this.modoEdicao && this.novoModelo.idModeloValidacao !== 0) {
      // Atualização
      this.modeloValidacaoService.atualizarModelo(this.novoModelo).subscribe({
        next: () => {
          alert('Modelo atualizado com sucesso!');
          this.carregarModelos();
          this.router.navigate(['/home/modelo-validacao']);
        },
        error: (err) => console.error('Erro ao atualizar modelo', err)
      });
    } else {
      // Inclusão
      const modeloParaSalvar = { ...this.novoModelo };
      delete modeloParaSalvar.idModeloValidacao;  // remove o ID antes de enviar

      this.modeloValidacaoService.salvarModelo(modeloParaSalvar as any).subscribe({
        next: () => {
          alert('Modelo salvo com sucesso!');
          this.carregarModelos();
          this.router.navigate(['/home/modelo-validacao']);
        },
        error: (err) => console.error('Erro ao salvar modelo', err)
      });
    }
  }
}
