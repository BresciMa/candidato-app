import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PerfilVagaComponent } from './perfil-vaga/perfil-vaga.component';
import { ModeloValidacaoComponent } from './modelo-validacao/modelo-validacao.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './home/home.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'perfil-vaga', component: PerfilVagaComponent },
      { path: 'modelo-validacao', component: ModeloValidacaoComponent },
    ],
  },

  // Remova essas rotas isoladas, pois já existem dentro de /home
  // { path: 'app', component: DashboardComponent, canActivate: [AuthGuard] },
  // { path: 'perfis', component: PerfilVagaComponent, canActivate: [AuthGuard] },

  // Fallback para qualquer rota inválida
  { path: '**', redirectTo: 'login' },
];