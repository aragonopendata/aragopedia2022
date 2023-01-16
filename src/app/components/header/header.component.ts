import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  activeDatos: boolean = false;
  activeServicios: boolean = false;
  activeInfo: boolean = false;

  linkSubmenu: any = document.getElementsByClassName('link-submenu');
  submenu: any = document.getElementsByClassName('submenu');

  fontSize: number = 16;

  constructor() { }

  ngOnInit(): void {

    window.addEventListener('click', (e) => {
      if (e.target !== this.linkSubmenu[0]
        && e.target !== this.linkSubmenu[1]
        && e.target !== this.linkSubmenu[2]
        && e.target !== this.submenu[0]
        && e.target !== this.submenu[1]
        && e.target !== this.submenu[2]) {
        this.activeDatos = false;
        this.activeInfo = false;
        this.activeServicios = false;
      }
    })
  }

  openSubMenuDatos() {
    this.activeDatos = !this.activeDatos;
    this.activeInfo = false;
    this.activeServicios = false;
  }

  openSubMenuInfo() {
    this.activeDatos = false;
    this.activeInfo = !this.activeInfo;
    this.activeServicios = false;
  }

  openSubMenuServicios() {
    this.activeDatos = false;
    this.activeInfo = false;
    this.activeServicios = !this.activeServicios;
  }

  changeFont(operator: string) {
    operator === '+' ? this.fontSize++ : this.fontSize--;
    document.getElementsByTagName('body')[0].style.fontSize = `${this.fontSize}px`;
  }

}
