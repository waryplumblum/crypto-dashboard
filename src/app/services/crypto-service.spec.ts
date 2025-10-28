import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CryptoService } from './crypto-service';

describe('CryptoService', () => {
  let service: CryptoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CryptoService]
    });
    service = TestBed.inject(CryptoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no queden requests pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch markets with correct params', () => {
    service.getMarkets('eur', 5, 2).subscribe();

    const req = httpMock.expectOne(
      r => r.url === 'https://api.coingecko.com/api/v3/coins/markets'
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('vs_currency')).toBe('eur');
    expect(req.request.params.get('per_page')).toBe('5');
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('order')).toBe('market_cap_desc');
    req.flush([]); // Responde con un array vacío
  });

  it('should fetch coin market chart with correct params', () => {
    service.getCoinMarketChart('bitcoin', 'usd', 14).subscribe();

    const req = httpMock.expectOne(
      r => r.url === 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart'
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('vs_currency')).toBe('usd');
    expect(req.request.params.get('days')).toBe('14');
    req.flush({}); // Responde con objeto vacío
  });
});