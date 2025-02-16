import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { SaleService } from '../../services/sale.service';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SaleListComponent } from '../../components/sale-list/sale-list.component';

@Component({
  selector: 'app-main-page',
  imports: [ProgressSpinnerModule, ButtonModule, SaleListComponent, RouterLink],
  templateUrl: './main-page.component.html',
})
export class MainPageComponent {

  private saleService = inject(SaleService);

  saleResource = rxResource({
    request: () => ({}),
    loader: () => this.saleService.getSales(),
  })
}
