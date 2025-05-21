import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfilVaga, PerfilVagaService } from './perfil-vaga.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil-vaga',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil-vaga.component.html',
  styleUrls: ['./perfil-vaga.component.css'],
})
export class PerfilVagaComponent implements OnInit {
  perfis: PerfilVaga[] = [];
  novoPerfil: PerfilVaga = { Descricao: '', Requisitos: '' };
  editandoPerfil: PerfilVaga | null = null;
  novaDescricao: string = '';
  novosRequisitos: string = '';

  constructor(private perfilService: PerfilVagaService) {}

  ngOnInit(): void {
    this.carregarPerfis();
  }

 carregarPerfis() {
    this.perfilService.listarPerfis().subscribe({
      next: (data) => this.perfis = data,
      error: (err) => console.error('Erro ao carregar perfis', err)
    });
  }

  adicionarPerfil() {
    this.perfis.push({ ...this.novoPerfil });
    this.novoPerfil = { Descricao: '', Requisitos: '' };
    this.salvar();
  }

  removerPerfil(index: number) {
    this.perfis.splice(index, 1);
    this.salvar();
  }

  salvar() {
    this.perfilService.salvarPerfis(this.perfis).subscribe({
      next: () => console.log('Perfis salvos com sucesso'),
      error: (err) => console.error('Erro ao salvar perfis', err)
    });
  }
}
