import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SaleService } from '../../../sale/services/sale.service';
import { ProductService } from '../../../product/services/product.service';
import { SellerService } from '../../../seller/services/seller.service';
import { catchError, forkJoin, map, of } from 'rxjs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { SaleResponse } from '../../../sale/interfaces/sale.interface';
import { ProductResponse } from '../../../product/interfaces/product.interface';
import { SellerResponse } from '../../../seller/interfaces/seller.interface';
import { rxResource } from '@angular/core/rxjs-interop';


interface DashboardData {
  sales: SaleResponse[];
  products: ProductResponse[];
  sellers: SellerResponse[];
}

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    ChartModule,
    TableModule,
    TagModule,
    ProgressSpinnerModule,
    MessageModule
  ]
})



export class HomePageComponent implements OnInit {
  ngOnInit(): void {
    this.getData();
  }

  private productService = inject(ProductService);
  private saleService = inject(SaleService);
  private sellerService = inject(SellerService);

  productSignal = signal<ProductResponse[]>([]);
  salesSignal = signal<SaleResponse[]>([]);
  sellerSignal = signal<SellerResponse[]>([]);

  // Computed signals para métricas
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  totalAmount = computed(() =>
    this.salesSignal().reduce((acc, sale) => acc + (sale.totalAmount || 0), 0)
  );



  totalProducts = computed(() =>
    this.salesSignal().reduce((acc, sale) =>
      acc + sale.saleDetails.reduce((detailAcc, detail) => detailAcc + (detail.quantity || 0), 0),
      0
    )
  );

  totalSellers = computed(() => this.sellerSignal().length);

  totalSales = computed(() => this.salesSignal().length);


  productsChartData = computed(() => ({
    labels: this.getTopProductsData().map(p => p.name),
    datasets: [{
      data: this.getTopProductsData().map(p => p.quantity),
      backgroundColor: ['#FF9800', '#2196F3', '#4CAF50', '#9C27B0', '#E91E63']
    }]
  }));



  chartOptions = {
    plugins: {
      legend: { position: 'bottom' }
    },
    responsive: true,
    maintainAspectRatio: false
  };

  // top 3 vendedores con más ventas
  topSellers = computed(() =>
    this.sellerSignal()
      .map(seller => ({
        ...seller,
        totalSales: this.salesSignal().reduce((acc, sale) =>
          acc + (sale.seller.id === seller.id ? sale.totalAmount || 0 : 0), 0
        )
      }))
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, 3)
  );

  topSellersChartData = computed(() => ({
    labels: this.topSellers().map(seller => seller.name),
    datasets: [{
      label: 'Ventas Totales',
      data: this.topSellers().map(seller => seller.totalSales),
      backgroundColor: ['#FF9800', '#2196F3', '#4CAF50'],
      borderColor: ['#FB8C00', '#1E88E5', '#43A047'],
      borderWidth: 1
    }]
  }));

  topSellersChartOptions = {
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return new Intl.NumberFormat('es-ES', {
              style: 'currency',
              currency: 'EUR'
            }).format(context.raw);
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => {
            return new Intl.NumberFormat('es-ES', {
              style: 'currency',
              currency: 'EUR',
              notation: 'compact'
            }).format(value);
          }
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    barThickness: 30
  };

  /// ventas por dia
  salesChartData = computed(() => {
    const labels = this.getLastSevenDaysLabels();
    const data = this.getLastSevenDaysData();

    console.log('Chart data:', { labels, data });

    return {
      labels,
      datasets: [{
        label: 'Ventas Diarias',
        data,
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4,
        fill: true
      }]
    };
  });

  private getLastSevenDaysLabels(): string[] {
    const labels = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      labels.push(date.toLocaleDateString('es-ES', {
        weekday: 'short',
        day: 'numeric'
      }));
    }

    return labels;
  }

  private getLastSevenDaysData(): number[] {
    const dailyData = new Array(7).fill(0);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Depuración
    console.log('Fecha inicio:', sevenDaysAgo);
    console.log('Fecha fin:', today);
    console.log('Ventas disponibles:', this.salesSignal());

    this.salesSignal().forEach(sale => {
      // Asegurarse de que la fecha de venta es válida
      const saleDate = new Date(sale.saleDate);
      console.log('Procesando venta:', {
        date: saleDate,
        amount: sale.totalAmount,
        rawDate: sale.saleDate
      });

      if (saleDate >= sevenDaysAgo && saleDate <= today) {
        const dayDiff = Math.floor(
          (saleDate.getTime() - sevenDaysAgo.getTime()) / (1000 * 60 * 60 * 24)
        );
        console.log('Venta válida para el día:', dayDiff);

        // Asegurarse de que el índice es válido
        if (dayDiff >= 0 && dayDiff < 7) {
          dailyData[dayDiff] += Number(sale.totalAmount || 0);
        }
      }
    });

    console.log('Datos diarios calculados:', dailyData);
    return dailyData;
  }

  salesChartOptions = {
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return new Intl.NumberFormat('es-ES', {
              style: 'currency',
              currency: 'EUR'
            }).format(context.raw);
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => {
            return new Intl.NumberFormat('es-ES', {
              style: 'currency',
              currency: 'EUR',
              notation: 'compact'
            }).format(value);
          }
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false
  };
  ///aqui termina ventas por dia

  private getProductName(productId: number): string {
    return this.productSignal().find(p => p.id === productId)?.name || 'Desconocido';
  }


  private getTopProductsData() {
    const productSales = this.salesSignal().reduce((acc, sale) => {
      sale.saleDetails.forEach(detail => {
        if (!acc[detail.productId]) {
          acc[detail.productId] = { total: 0, quantity: 0, name: this.getProductName(detail.productId) };
        }
        acc[detail.productId].total += detail.unitPrice || 0;
        acc[detail.productId].quantity += detail.quantity || 0;
      });
      return acc;
    }, {} as Record<string, { total: number; quantity: number; name: string }>);

    return Object.values(productSales)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }



  getData() {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      products: this.productService.getProducts(),
      sellers: this.sellerService.getSellers(),
      sales: this.saleService.getSales()
    }).subscribe({
      next: ({ products, sellers, sales }) => {
        console.log('Datos recibidos:', { products, sellers, sales });
        this.productSignal.set(products);
        this.sellerSignal.set(sellers);
        this.salesSignal.set(sales);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.error.set('Error al cargar los datos');
        this.loading.set(false);
      }
    });
  }

}
