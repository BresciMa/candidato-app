import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { PerfilVaga, PerfilVagaService } from '../perfil-vaga.service';

@Component({
  selector: 'app-perfil-vaga-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './perfil-vaga-form.component.html',
  styleUrls: ['./perfil-vaga-form.component.css']
})
export class PerfilVagaFormComponent implements OnInit {
  perfilVaga: PerfilVaga = {
    IdPerfilVaga: '',
    Descricao: '',
    Requisitos: ''
  };
  modoEdicao = false;

  constructor(
    private perfilService: PerfilVagaService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Check if we're editing an existing profile
    const state = history.state;
    if (state && state.perfil) {
      this.perfilVaga = { ...state.perfil };
      this.modoEdicao = true;
    }

    // Alternative approach using route params
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.perfilService.listarPerfis().subscribe({
        next: (perfis) => {
          const perfilEncontrado = perfis.find(p => p.IdPerfilVaga === id);
          if (perfilEncontrado) {
            this.perfilVaga = { ...perfilEncontrado };
            this.modoEdicao = true;
          }
        },
        error: (err) => console.error('Error loading profile', err)
      });
    }
  }

  salvar() {
    if (this.modoEdicao) {
      // Update existing profile
      this.perfilService.atualizarPerfil(this.perfilVaga).subscribe({
        next: () => {
          alert('Perfil atualizado com sucesso!');
          this.router.navigate(['/home/perfil-vaga']);
        },
        error: (err) => console.error('Erro ao atualizar perfil', err)
      });
    } else {
      // Create new profile
      this.perfilService.criarPerfil(this.perfilVaga).subscribe({
        next: () => {
          alert('Perfil criado com sucesso!');
          this.router.navigate(['/home/perfil-vaga']);
        },
        error: (err) => console.error('Erro ao criar perfil', err)
      });
    }
  }

  voltar() {
    this.router.navigate(['/home/perfil-vaga']);
  }
}
