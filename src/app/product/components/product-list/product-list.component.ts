import { Component, input } from '@angular/core';
import { ProductResponse, Status } from '../../interfaces/product.interface';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { Tooltip } from 'primeng/tooltip';


@Component({
  selector: 'product-list',
  imports: [TableModule, CommonModule, BadgeModule, ButtonModule, RouterLink, Tooltip],
  templateUrl: './product-list.component.html',
})
export class ProductListComponent {

  products = input.required<ProductResponse[]>();

  rowStyle(product: ProductResponse) {
    if (product.stock === 0) {
      return { fontWeight: 'bold', fontStyle: 'italic' };
    }
    return {};
  }

  stockSeverity(product: ProductResponse) {
    if (product.stock === 0) return 'danger';
    else if (product.stock > 0 && product.stock < 10) return 'warn';
    else return 'success';
  }

  statusSeverity(product: ProductResponse) {
    switch (product.status) {
      case Status.Activo:
        return 'success';
      case Status.Agotado:
        return 'danger';
      case Status.Inactivo:
        return 'warn';
      default:
        return 'info';
    }
  }
}
