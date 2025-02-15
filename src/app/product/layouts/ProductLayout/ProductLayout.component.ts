import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenubarModule } from 'primeng/menubar'

@Component({
  selector: 'app-product-layout',
  imports: [RouterOutlet, MenubarModule],
  templateUrl: './ProductLayout.component.html',
})
export class ProductLayoutComponent { }
