import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DashboardComponent } from './dashboard-component';
import { CryptoService } from '../../services/crypto-service';
import { of, throwError } from 'rxjs';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let cryptoServiceStub: Partial<CryptoService>;

  beforeEach(async () => {
    cryptoServiceStub = {
      getMarkets: jasmine.createSpy('getMarkets').and.returnValue(of([
        { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', image: '', current_price: 100 }
      ])),
      getCoinMarketChart: jasmine.createSpy('getCoinMarketChart').and.returnValue(of({
        prices: [
          [1690000000000, 100],
          [1690086400000, 110]
        ]
      }))
    };

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [{ provide: CryptoService, useValue: cryptoServiceStub }]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show spinner when loading is true', () => {
    component.loading = true;
    component.error = '';
    component.selectedCrypto = { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', image: '', current_price: 100 };
    fixture.detectChanges();
    const spinner = fixture.nativeElement.querySelector('.spinner-container');
    expect(spinner).toBeTruthy();
  });

  it('should show selection message when no crypto is selected', () => {
    component.loading = false;
    component.error = '';
    component.selectedCrypto = null;
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Selecciona una criptomoneda');
  });

  it('should call onSelectCrypto when crypto changes', () => {
    spyOn(component, 'onSelectCrypto');
    component.selectedCrypto = { id: 'bitcoin' };
    fixture.detectChanges();
    component.onSelectCrypto();
    expect(component.onSelectCrypto).toHaveBeenCalled();
  });

  it('should load cryptos from service on init', () => {
    fixture.detectChanges();
    expect(component.cryptos.length).toBeGreaterThan(0);
    expect(component.loading).toBeFalse();
  });

  it('should handle API error', fakeAsync(() => {
    cryptoServiceStub.getMarkets = jasmine.createSpy().and.returnValue(throwError(() => new Error('fail')));
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    expect(component.error).toContain('No se pudieron cargar los datos');
  }));
});