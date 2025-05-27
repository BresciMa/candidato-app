import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router  } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PerfilVaga, PerfilVagaService } from './perfil-vaga.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil-vaga',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './perfil-vaga.component.html',
  styleUrls: ['./perfil-vaga.component.css'],
})
export class PerfilVagaComponent implements OnInit {
  perfis: PerfilVaga[] = [];
  novoPerfil: PerfilVaga = { Descricao: '', Requisitos: '', IdPerfilVaga: '' };
  idPerfisDisponiveis: string[] = [];
  editandoPerfil: PerfilVaga | null = null;
  novaDescricao: string = '';
  novosRequisitos: string = '';
  novoIdPerfilVaga: string = '';
  editando = false;
  modoEdicao: boolean = false;

  constructor(private perfilService: PerfilVagaService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  editarPerfil(perfil: PerfilVaga) {
    this.modoEdicao = true;
    this.router.navigate(['/home/perfil-vaga/editar', perfil.IdPerfilVaga], {
      state: { perfil }
    });
  }

  ngOnInit(): void {
    this.carregarPerfis();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editando = true;
      this.perfilService.listarPerfis().subscribe({
        next: (data) => {
          const encontrado = data.find(p => p.IdPerfilVaga === id);
          if (encontrado) {
            this.novoPerfil = { ...encontrado };
          } else {
            alert('Perfil não encontrado!');
            this.router.navigate(['/home/perfil-vaga']);
          }
        },
        error: (err) => console.error('Erro ao carregar perfil', err)
      });
    }
  }

 carregarPerfis() {
    this.perfilService.listarPerfis().subscribe({
      next: (data) => this.perfis = data,
      error: (err) => console.error('Erro ao carregar perfis', err)
    });
  }

  adicionarPerfil() {
    this.novoPerfil = { Descricao: '', Requisitos: '', IdPerfilVaga: '' };
    this.modoEdicao = false;  // Define como inclusão
    this.perfis.push({ ...this.novoPerfil });
    this.salvar();
  }

  removerPerfil(id: string): void {
    if (confirm('Tem certeza que deseja remover este perfil?')) {
      this.perfilService.removerPerfil(id).subscribe({
        next: () => {
          alert('Perfil removido com sucesso!');
          this.carregarPerfis(); // Refresh the list
        },
        error: (err) => console.error('Erro ao remover perfil', err)
      });
    }
  }

  salvar() {
    this.perfilService.salvarPerfis([this.novoPerfil]).subscribe({
      next: () => {
        alert('Perfil salvo com sucesso!');
        this.router.navigate(['/home/perfil-vaga']);
      },
      error: (err) => console.error('Erro ao salvar perfil', err)
    });
  }
}
