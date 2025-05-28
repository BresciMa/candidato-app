import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-resultado-analise',
  standalone: true,
  templateUrl: './resultado-analise.component.html',
  imports: [CommonModule],
  styleUrls: ['./resultado-analise.component.css']
})
export class ResultadoAnaliseComponent implements OnInit {
  resultado: any;
  constructor(private router: Router, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  const nav = this.router.getCurrentNavigation();
  const resultadoHtml = nav?.extras?.state?.resultado;

  if (resultadoHtml) {
    this.resultado = this.sanitizer.bypassSecurityTrustHtml(resultadoHtml);
  } else {
    const resultadoSalvo = sessionStorage.getItem('resultadoAnalise');
    if (resultadoSalvo) {
      this.resultado = this.sanitizer.bypassSecurityTrustHtml(resultadoSalvo);
    } else {
      this.resultado = 'Nenhum resultado encontrado.';
    }
  }
}
}
