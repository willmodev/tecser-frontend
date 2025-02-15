import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  templateUrl: 'main-page.component.html'
})

export class MainPageComponent {
  private productService = inject(ProductService);


  productResource = rxResource({
    request: () => ({}),
    loader: ({ request }) => this.productService.getProducts(),
  })
}
