import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProductResponse } from '../interfaces/product.interface';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';


const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class ProductService {

  private http = inject(HttpClient);

  getProducts(): Observable<ProductResponse[]> {
    return this.http.get<ProductResponse>(`${baseUrl}/products`)
      .pipe(tap(console.log));
  }

  getProductById(id: string): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${baseUrl}/products/${id}`)
      .pipe(
        tap(response => console.log('Product found:', response))
      );
  }

  createProduct(product: Omit<ProductResponse, 'id'>): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(`${baseUrl}/products`, product)
      .pipe(
        tap(response => console.log('Created product:', response))
      );
  }

  updateProduct(id: string, product: Omit<ProductResponse, 'id'>): Observable<ProductResponse> {
    return this.http.put<ProductResponse>(`${baseUrl}/products/${id}`, product)
      .pipe(
        tap(response => console.log('Updated product:', response))
      );
  }

}
