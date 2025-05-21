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
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // redireciona para dashboard ao acessar /home
      { path: 'dashboard', component: DashboardComponent }, // opcional
      { path: 'perfil-vaga', component: PerfilVagaComponent },
      { path: 'modelo-validacao', component: ModeloValidacaoComponent }
    ]
  },
  { path: 'app', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'perfis', component: PerfilVagaComponent, canActivate: [AuthGuard] },
];

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // redireciona para dashboard ao acessar /home
      { path: 'dashboard', component: DashboardComponent }, // opcional
      { path: 'perfil-vaga', component: PerfilVagaComponent },
      { path: 'modelo-validacao', component: ModeloValidacaoComponent }
    ]
  },
  { path: '**', redirectTo: '' } // fallback para qualquer rota inválida
];