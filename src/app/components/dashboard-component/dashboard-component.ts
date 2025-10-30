import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CryptoChartComponent } from "../crypto-chart-component/crypto-chart-component";
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { CryptoService } from '../../services/crypto-service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-dashboard-component',
  imports: [CommonModule, MatListModule, MatProgressSpinnerModule, CryptoChartComponent, FormsModule, MatFormFieldModule, MatSelectModule, MatCardModule, MatSlideToggleModule],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.scss',
})
export class DashboardComponent implements OnInit {
  cryptos: any[] = [];
  loading = true;
  error = '';

  selectedCrypto: any = null;
  selectedDays: number = 7;
  selectedChartType: 'line' | 'bar' = 'line';
  selectedCurrency: 'usd' | 'eur' = 'usd';

  isMobile = false;
  showFilters = false;

  @ViewChild('cryptoChart') cryptoChartComp!: CryptoChartComponent;


  compareCrypto = (a: any, b: any) => a && b && a.id === b.id;

  constructor(private cryptoService: CryptoService) { }

  ngOnInit() {
    this.onResize();
    this.cryptoService.getMarkets().subscribe({
      next: data => {
        this.cryptos = data;
        this.loading = false;
      },
      error: err => {
        this.error = 'No se pudieron cargar los datos';
        this.loading = false;
      }
    });
  }

  onSelectCrypto() {
    // Puedes hacer tracking, analytics, etc. aquí si quieres
    // Si quieres resetear un filtro al seleccionar otra cripto, hazlo aquí
  }

  @HostListener('window:resize', [])
  onResize() {
    this.isMobile = window.innerWidth < 600;
    if (!this.isMobile) this.showFilters = true; // Siempre muestra en desktop
  }

  toggleTheme(isDark: boolean) {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark-theme');
    } else {
      html.classList.remove('dark-theme');
    }
    // Espera un momento y refresca el chart
    setTimeout(() => {
      this.cryptoChartComp.refreshChartColors();
    }, 100);
  }

}