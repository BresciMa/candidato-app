import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usuario = '';
  senha = '';

  constructor(private router: Router) {}

  login() {
    if (this.usuario === 'admin' && this.senha === 'admin') {
      this.router.navigate(['/app']);
    } else {
      alert('Usuário ou senha inválidos!');
    }
  }
}