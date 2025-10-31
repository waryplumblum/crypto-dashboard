import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CryptoService } from '../../services/crypto-service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartType, ChartOptions, ChartData } from 'chart.js';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  selector: 'app-crypto-chart-component',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, MatProgressSpinnerModule],
  templateUrl: './crypto-chart-component.html',
  styleUrl: './crypto-chart-component.scss',
})
export class CryptoChartComponent implements OnChanges {

  @Input() coinId: string = '';
  @Input() coinName: string = '';
  @Input() days: number = 7;
  @Input() chartType: ChartType = 'line';
  @Input() currency: string = 'usd';

  loading = false;
  error = '';

  lineChartData: ChartData<'line' | 'bar'> = {
    labels: [],
    datasets: []
  };
  lineChartType: ChartType = 'line';
  lineChartOptions: ChartOptions = {};

  constructor(private cryptoService: CryptoService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (
      (this.coinId && changes['coinId']) ||
      changes['days'] ||
      changes['chartType'] ||
      changes['currency']
    ) {
      this.fetchChart();
    }
  }

  getChartOptions(): ChartOptions {
    const isDark = this.isDarkMode();
    const axisColor = isDark ? "#ffffff" : "#5c5c5c";
    const gridColor = isDark ? "#888" : "#f0f0f0";
    const titleColor = isDark ? "#ffffff" : "#222";
    const legendColor = isDark ? "#ffffff" : "#1976d2";
    const tooltipBg = isDark ? "#181818" : "#fff";
    const tooltipText = isDark ? "#ffffff" : "#222";
    const currencySymbol = this.currency === 'usd' ? '$' : this.currency === 'eur' ? '€' : this.currency.toUpperCase();

    return {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: legendColor,
            font: { size: 14, weight: 'bold' }
          }
        },
        tooltip: {
          enabled: true,
          backgroundColor: tooltipBg,
          titleColor: tooltipText,
          bodyColor: tooltipText,
          borderColor: "#aaa",
          borderWidth: 1,
          callbacks: {
            label: (context) => {
              const value = context.parsed.y ?? context.parsed;
              const label = context.dataset.label || '';
              const formattedValue = value.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              });
              return `${label}: ${currencySymbol}${formattedValue}`;
            },
            title: (items) => items[0]?.label ?? ''
          }
        },
        title: {
          display: true,
          text: `${this.coinName} - Últimos ${this.days} días`,
          color: titleColor,
          font: { size: 18, weight: 'bold' }
        }
      },
      elements: {
        line: {
          borderColor: "#1976d2",
          borderWidth: 2,
          fill: true,
          backgroundColor: "rgba(25, 118, 210, 0.12)"
        },
        point: {
          radius: 4,
          backgroundColor: "#1976d2",
          borderColor: "#fff",
          borderWidth: 2
        }
      },
      scales: {
        x: {
          grid: { color: gridColor },
          ticks: { color: axisColor }
        },
        y: {
          grid: { color: gridColor },
          ticks: {
            color: axisColor,
            callback: function (value) {
              return `${currencySymbol}${(+value).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}`;
            }
          }
        }
      }
    };
  }

  fetchChart() {
    this.loading = true;
    this.lineChartType = this.chartType;
    this.lineChartOptions = this.getChartOptions();

    const start = Date.now();

    this.cryptoService.getCoinMarketChart(this.coinId, this.currency, this.days).subscribe({
      next: (data) => {
        const prices = data.prices.map((x: any) => ({
          date: new Date(x[0]),
          value: x[1]
        }));

        const dayLabels: string[] = [];
        const dayData: number[] = [];

        prices.forEach((item: { date: Date; value: number }) => {
          const day = item.date.toLocaleDateString();
          if (!dayLabels.includes(day)) {
            dayLabels.push(day);
            dayData.push(item.value);
          }
        });

        this.lineChartData = {
          labels: dayLabels,
          datasets: [
            {
              data: dayData,
              label: `Precio ${this.coinName}`,
              fill: this.chartType === 'line',
              backgroundColor: this.chartType === 'bar' ? "#1976d2" : "rgba(25, 118, 210, 0.12)",
              borderColor: "#1976d2"
            }
          ]
        };

        const elapsed = Date.now() - start;
        const minTime = 1500;
        if (elapsed < minTime) {
          setTimeout(() => {
            this.loading = false;
          }, minTime - elapsed);
        } else {
          this.loading = false;
        }
      },
      error: () => {
        const elapsed = Date.now() - start;
        const minTime = 1000;
        this.error = 'No se pudo cargar el gráfico';
        if (elapsed < minTime) {
          setTimeout(() => {
            this.loading = false;
          }, minTime - elapsed);
        } else {
          this.loading = false;
        }
      }
    });
  }

  isDarkMode(): boolean {
    return document.documentElement.classList.contains('dark-theme');
  }

  public refreshChartColors() {
    this.lineChartOptions = this.getChartOptions();
    setTimeout(() => window.dispatchEvent(new Event('resize')), 10);
  }


}