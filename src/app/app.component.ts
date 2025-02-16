import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';

@Component({
  selector: 'app-root',
  imports: [Menubar, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Inicio',
        icon: 'pi pi-home',
        routerLink: ['/']
      },
      {
        label: 'Productos',
        icon: 'pi pi-shopping-cart',
        routerLink: ['/products']
      },
      {
        label: 'Vendedores',
        icon: 'pi pi-user',
        routerLink: ['/sellers']
      },
      {
        label: 'Ventas',
        icon: 'pi pi-money-bill',
        routerLink: ['/sales']
      }
    ]
  }
}
