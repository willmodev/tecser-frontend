import { Component, input } from '@angular/core';
import { SaleResponse } from '../../interfaces/sale.interface';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { Tooltip, TooltipModule } from 'primeng/tooltip';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'sale-list',
  imports: [TableModule, CommonModule, BadgeModule, ButtonModule, RouterLink],
  templateUrl: './sale-list.component.html',
})
export class SaleListComponent {
  sales = input.required<SaleResponse[]>();
  expandedRows: Record<number, boolean> = {};

  expandAll() {
    this.expandedRows = this.sales().reduce<Record<number, boolean>>((acc, s) => {
      acc[s.id] = true;
      return acc;
    }, {});
  }

  collapseAll() {
    this.expandedRows = {};
  }

}
