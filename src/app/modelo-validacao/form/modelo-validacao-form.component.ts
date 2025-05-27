import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import {  ModeloValidacao, ModeloValidacaoService  } from '../modelo-validacao.service';

@Component({
  selector: 'app-modelo-validacao-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './modelo-validacao-form.component.html',
  styleUrls: ['./modelo-validacao-form.component.css']
})
export class ModeloValidacaoFormComponent implements OnInit {
  modeloValidacao: ModeloValidacao = {
    idModelo: '',
    Descricao: '',
    Prompt: ''
  };
  modoEdicao = false;

  constructor(
    private modeloService: ModeloValidacaoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Check if we're editing an existing profile
    const state = history.state;
    if (state && state.modelo) {
      this.modeloValidacao = { ...state.modelo };
      this.modoEdicao = true;
    }

    // Alternative approach using route params
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modeloService.listarModelos().subscribe({
        next: (modelos) => {
          const modeloEncontrado = modelos.find(m => m.idModelo === id);
          if (modeloEncontrado) {
            this.modeloValidacao = { ...modeloEncontrado };
            this.modoEdicao = true;
          }
        },
        error: (err) => console.error('Error loading model', err)
      });
    }
  }

  salvar() {
    if (this.modoEdicao) {
      // Update existing model
      this.modeloService.atualizarModelo(this.modeloValidacao).subscribe({
        next: () => {
          alert('Modelo atualizado com sucesso!');
          this.router.navigate(['/home/modelo-validacao']);
        },
        error: (err) => console.error('Erro ao atualizar modelo', err)
      });
    } else {
      // Create new model
      this.modeloService.criarModelo(this.modeloValidacao).subscribe({
        next: () => {
          alert('Modelo criado com sucesso!');
          this.router.navigate(['/home/modelo-validacao']);
        },
        error: (err) => console.error('Erro ao criar modelo', err)
      });
    }
  }

  voltar() {
    this.router.navigate(['/home/modelo-validacao']);
  }
}
