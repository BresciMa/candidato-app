import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PerfilVagaComponent } from './perfil-vaga/perfil-vaga.component';
import { ModeloValidacaoComponent } from './modelo-validacao/modelo-validacao.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './login/auth.guard';
import { HomeComponent } from './home/home.component';
import { PerfilVagaFormComponent } from './perfil-vaga/form/perfil-vaga-form.component';
import { ModeloValidacaoFormComponent } from './modelo-validacao/form/modelo-validacao-form.component';
import { ResultadoAnaliseComponent } from './resultado-analise/resultado-analise.component';
import { CandidatoComponent } from './candidato/candidato.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'candidato', pathMatch: 'full' },
      { path: 'candidato', component: CandidatoComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'perfil-vaga', component: PerfilVagaComponent },
      { path: 'perfil-vaga/novo', component: PerfilVagaFormComponent },
      { path: 'modelo-validacao/novo', component: ModeloValidacaoFormComponent },
      { path: 'modelo-validacao', component: ModeloValidacaoComponent },
      { path: 'perfil-vaga/editar/:id', component: PerfilVagaFormComponent },
      { path: 'modelo-validacao/editar/:id', component: ModeloValidacaoFormComponent },
      { path: 'resultado-analise', component: ResultadoAnaliseComponent },
      { path: '**', redirectTo: '' }
    ],
  },

  // Fallback para qualquer rota inválida
  { path: '**', redirectTo: 'login' },
];
