import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CryptoChartComponent } from './crypto-chart-component';
import { CryptoService } from '../../services/crypto-service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend, Filler, BarController, BarElement } from 'chart.js';

Chart.register(
  LineController, LineElement, PointElement,
  LinearScale, Title, CategoryScale, Tooltip, Legend, Filler,
  BarController, BarElement
);

describe('CryptoChartComponent', () => {
  let component: CryptoChartComponent;
  let fixture: ComponentFixture<CryptoChartComponent>;
  let cryptoServiceStub: Partial<CryptoService>;

  beforeEach(async () => {
    cryptoServiceStub = {
      getCoinMarketChart: jasmine.createSpy('getCoinMarketChart').and.returnValue(of({
        prices: [
          [1690000000000, 100],
          [1690086400000, 110]
        ]
      }))
    };

    await TestBed.configureTestingModule({
      imports: [CryptoChartComponent],
      providers: [{ provide: CryptoService, useValue: cryptoServiceStub }]
    }).compileComponents();

    fixture = TestBed.createComponent(CryptoChartComponent);
    component = fixture.componentInstance;
    component.coinId = 'bitcoin';
    component.coinName = 'Bitcoin';
    component.days = 7;
    component.currency = 'usd';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show spinner when loading is true', () => {
    component.loading = true;
    fixture.detectChanges();
    const spinner = fixture.nativeElement.querySelector('.spinner-container');
    expect(spinner).toBeTruthy();
  });

  it('should show error message and retry button when error is set', () => {
    component.loading = false;
    component.error = "Error!";
    fixture.detectChanges();
    const errorMsg = fixture.nativeElement.querySelector('.error-message');
    expect(errorMsg.textContent).toContain("Error!");
    const retryBtn = fixture.nativeElement.querySelector('.retry-btn');
    expect(retryBtn).toBeTruthy();
  });

  it('should call fetchChart on retry click', () => {
    spyOn(component, 'fetchChart');
    component.loading = false;
    component.error = "Error!";
    fixture.detectChanges();
    const retryBtn = fixture.debugElement.query(By.css('.retry-btn'));
    retryBtn.nativeElement.click();
    expect(component.fetchChart).toHaveBeenCalled();
  });

  it('should render chart when not loading and no error', () => {
    component.loading = false;
    component.error = '';
    fixture.detectChanges();
    const chart = fixture.nativeElement.querySelector('.chart-responsive-wrapper');
    expect(chart).toBeTruthy();
  });

  it('should update chart data when fetchChart is called', fakeAsync(() => {
    component.lineChartData = { labels: [], datasets: [] };
    component.fetchChart();
    tick(1600); 
    fixture.detectChanges();
    expect(component.lineChartData.labels?.length).toBeGreaterThan(0);
    expect(component.loading).toBeFalse();
  }));

  it('should handle service error and show error message', fakeAsync(() => {
    (cryptoServiceStub.getCoinMarketChart as jasmine.Spy).and.returnValue(throwError(() => new Error('fail')));
    component.coinId = 'bitcoin';
    component.loading = true;
    component.error = '';
    component.fetchChart();
    tick(1100);
    fixture.detectChanges();
    expect(component.error).toContain('No se pudo cargar el gráfico');
    expect(component.loading).toBeFalse();
  }));

  it('should set aria-label with coinName', () => {
    component.loading = false;
    component.error = '';
    fixture.detectChanges();
    const wrapper = fixture.nativeElement.querySelector('.chart-responsive-wrapper');
    expect(wrapper.getAttribute('aria-label')).toContain(component.coinName);
  });
});