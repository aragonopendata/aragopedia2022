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

  bodyOverlay: boolean = false;

  linkSubmenu: any = document.getElementsByClassName('link-submenu');
  submenu: any = document.getElementsByClassName('submenu');
  body: any = document.getElementsByTagName('body');

  fontSize: number = 16;

  constructor() { }

  ngOnInit(): void {

    window.addEventListener('click', (e) => {
      if (e.target !== this.linkSubmenu[0]
        && e.target !== this.linkSubmenu[1]
        && e.target !== this.linkSubmenu[2]
        && e.target !== this.linkSubmenu[3]
        && e.target !== this.linkSubmenu[4]
        && e.target !== this.linkSubmenu[5]
        && e.target !== this.submenu[0]
        && e.target !== this.submenu[1]
        && e.target !== this.submenu[2]) {
        this.activeDatos = false;
        this.activeInfo = false;
        this.activeServicios = false;
        this.bodyOverlay = false;
      }
    });
  }

  openSubMenuDatos() {
    this.activeDatos = !this.activeDatos;
    this.activeInfo = false;
    this.activeServicios = false;
    this.bodyOverlay = !this.bodyOverlay;
    if (this.activeDatos || this.activeInfo || this.activeServicios) {
      this.bodyOverlay = true;
    }
  }

  openSubMenuInfo() {
    this.activeInfo = !this.activeInfo;
    this.activeDatos = false;
    this.activeServicios = false;
    this.bodyOverlay = !this.bodyOverlay;
    if (this.activeDatos || this.activeInfo || this.activeServicios) {
      this.bodyOverlay = true;
    }
  }

  openSubMenuServicios() {
    this.activeDatos = false;
    this.activeInfo = false;
    this.bodyOverlay = !this.bodyOverlay;
    this.activeServicios = !this.activeServicios;
    if (this.activeDatos || this.activeInfo || this.activeServicios) {
      this.bodyOverlay = true;
    }

  }

  changeFont(operator: string) {
    operator === '+' ? document.getElementsByTagName('body')[0].classList.add('zoomed') : document.getElementsByTagName('body')[0].classList.remove('zoomed');
  }

}
