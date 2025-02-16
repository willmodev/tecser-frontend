import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductResponse } from '../../interfaces/product.interface';
import { ProductListComponent } from "../../components/product-list/product-list.component";
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
@Component({
  selector: 'product-main-page',
  templateUrl: 'main-page.component.html',
  imports: [ProductListComponent, ProgressSpinnerModule, ButtonModule]
})

export class MainPageComponent {
  private productService = inject(ProductService);
  private router = inject(Router);
  private products: ProductResponse[] = [];


  productResource = rxResource({
    request: () => ({}),
    loader: ({ request }) => {
      return this.productService.getProducts();
    }
  })

  navigateBy(): void {
    this.router.navigate(['products/register']);
  }


}
