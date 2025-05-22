import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service'; // <-- Importa o AuthService

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private authService: AuthService, private router: Router) {}
  
  logout() {
    this.authService.logout();  // <-- Chama o logout do AuthService
    this.router.navigate(['/login']);  // <-- Redireciona para login
  }
}