import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { SellerService } from '../../services/seller.service';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SellerListComponent } from '../../components/seller-list/seller-list.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  imports: [ProgressSpinnerModule, ButtonModule, SellerListComponent, RouterLink],
})
export class MainPageComponent {


  private sellerService = inject(SellerService);


  sellerResource = rxResource({
    request: () => ({}),
    loader: ({ request }) => this.sellerService.getSellers()
  })


}
