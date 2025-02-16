import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Sale, SaleResponse } from '../interfaces/sale.interface';
import { Observable, tap } from 'rxjs';

const baseUrl = environment.baseUrl

@Injectable({ providedIn: 'root' })
export class SaleService {

  private http = inject(HttpClient);


  public createSale(sale: Sale): Observable<SaleResponse> {
    return this.http.post<SaleResponse>(`${baseUrl}/sales`, sale)
      .pipe(tap(console.log));
  }


  public getSales(): Observable<SaleResponse[]> {
    return this.http.get<SaleResponse[]>(`${baseUrl}/sales`)
      .pipe(tap(console.log));
  }
}
