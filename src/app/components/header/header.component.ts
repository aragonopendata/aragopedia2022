import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  // El componente ahora es más sencillo ya que Desy maneja los dropdowns automáticamente
  
  constructor() { }

  ngOnInit(): void {
    // No necesitamos manejar eventos de clic globales, Desy gestiona eso internamente
  }

  // Esta función sigue siendo útil para cambios de tamaño de fuente a nivel de aplicación
  changeFont(operator: string) {
    operator === '+' 
      ? document.getElementsByTagName('body')[0].classList.add('zoomed') 
      : document.getElementsByTagName('body')[0].classList.remove('zoomed');
  }
}
