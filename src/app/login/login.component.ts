import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  usuario: string = '';
  senha: string = '';
  loginInvalido: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  loginPage() {
    this.authService.login(this.usuario, this.senha).subscribe({
      next: (res) => {
        this.loginInvalido = false;
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Erro ao fazer login:', err);
        this.loginInvalido = true;
      },
    });
  }
}
