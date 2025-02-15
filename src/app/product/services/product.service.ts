import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProductResponse } from '../interfaces/product.interface';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private http = inject(HttpClient);

  getProducts(): Observable<ProductResponse> {
    return this.http.get<ProductResponse>('http://localhost:8080/api/products')
      .pipe(tap(console.log));
  }

}
