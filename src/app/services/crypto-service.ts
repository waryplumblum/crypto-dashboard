import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private apiUrl = 'https://api.coingecko.com/api/v3';

  constructor(private http: HttpClient) {}

  getMarkets(currency = 'usd', perPage = 10, page = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/coins/markets`, {
      params: {
        vs_currency: currency,
        order: 'market_cap_desc',
        per_page: perPage,
        page: page,
        sparkline: 'false'
      }
    });
  }

  getCoinMarketChart(id: string, currency = 'usd', days = 7): Observable<any> {
    return this.http.get(`${this.apiUrl}/coins/${id}/market_chart`, {
      params: {
        vs_currency: currency,
        days: days
      }
    });
  }
}