import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  usuario: string = '';
  senha: string = '';
  loginInvalido: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    const sucesso = this.authService.login(this.usuario, this.senha);

    if (sucesso) {
      this.loginInvalido = false;
      this.router.navigate(['/home']);
    } else {
      this.loginInvalido = true;
    }
  }
}