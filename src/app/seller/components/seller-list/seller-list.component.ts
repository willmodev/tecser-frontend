import { Component, input } from '@angular/core';
import { SellerResponse } from '../../interfaces/seller.interface';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'seller-list',
  templateUrl: './seller-list.component.html',
  imports: [TableModule, CommonModule, BadgeModule, ButtonModule, RouterLink, Tooltip],
})
export class SellerListComponent {

  sellers = input.required<SellerResponse[]>();

  statusSeverity(seller: SellerResponse) {
    if (seller.isActive) return 'success';
    else return 'danger';
  }

  rowStyle(seller: SellerResponse) {
    return (seller.isActive) ? {} : { fontWeight: 'bold', fontStyle: 'italic' };
  }

}
