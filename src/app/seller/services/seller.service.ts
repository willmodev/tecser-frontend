import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable, tap } from 'rxjs';
import { SellerResponse } from '../interfaces/seller.interface';

const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class SellerService {

  private http = inject(HttpClient);


  public getSellers(): Observable<SellerResponse[]> {
    return this.http.get<SellerResponse>(`${baseUrl}/sellers`)
      .pipe(tap(console.log));
  }

  public getSellerById(id: string): Observable<SellerResponse> {
    return this.http.get<SellerResponse>(`${baseUrl}/sellers/${id}`)
      .pipe(tap(console.log));
  }

  public createSeller(seller: Omit<SellerResponse, 'id' | 'registrationDate'>): Observable<SellerResponse> {
    return this.http.post<SellerResponse>(`${baseUrl}/sellers`, seller)
      .pipe(tap(console.log));
  }

  public updateSeller(id: string, seller: Omit<SellerResponse, 'id' | 'registrationDate'>): Observable<SellerResponse> {
    return this.http.put<SellerResponse>(`${baseUrl}/sellers/${id}`, seller)
      .pipe(tap(console.log));
  }

  public deleteSeller(id: string): Observable<void> {
    return this.http.delete<void>(`${baseUrl}/sellers/${id}`)
      .pipe(tap(console.log));
  }

}
