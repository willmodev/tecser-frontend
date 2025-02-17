import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule, FormsModule, PatternValidator } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { AutoComplete, AutoCompleteModule } from 'primeng/autocomplete';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { Sale } from '../../interfaces/sale.interface';
import { SellerResponse } from '../../../seller/interfaces/seller.interface';
import { ProductResponse, Status } from '../../../product/interfaces/product.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { SellerService } from '../../../seller/services/seller.service';
import { ProductService } from '../../../product/services/product.service';
import { SaleService } from '../../services/sale.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sale-form-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    AutoComplete, FormsModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './sale-form-page.component.html',
})
export class SaleFormPageComponent implements OnInit {


  private sellerService = inject(SellerService);
  private productService = inject(ProductService);
  private saleService = inject(SaleService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private router = inject(Router);

  saleForm!: FormGroup;
  filteredSellers = signal<SellerResponse[]>([]);
  filteredProducts = signal<ProductResponse[]>([]);
  selectedProduct = signal<ProductResponse | undefined>(undefined);

  totalAmount = computed(() =>
    this.saleDetails.controls.reduce((sum, detail) =>
      sum + (detail.get('subtotal')?.value || 0), 0)
  );

  ngOnInit(): void {
    this.initForm();
  }

  sellerResource = rxResource({
    request: () => ({}),
    loader: () => this.sellerService.getSellers(),
  })

  productResource = rxResource({
    request: () => ({}),
    loader: () => this.productService.getProducts(),
  })

  private initForm(): void {
    this.saleForm = this.fb.group({
      saleNumber: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{4,10}$/)]],
      sellerId: [null],
      selectedSeller: [null, Validators.required],
      totalAmount: [0],
      comments: [''],
      saleDetails: this.fb.array([])
    });
  }

  get saleDetails(): FormArray {
    return this.saleForm.get('saleDetails') as FormArray;
  }

  filterSellers(event: any): void {
    const query = event.query.toLowerCase();
    this.filteredSellers.set(
      this.sellerResource.value()!.filter(seller =>
        seller.name.toLowerCase().includes(query)
      )
    );

  }

  filterProducts(event: any): void {
    const query = event.query.toLowerCase();
    this.filteredProducts.set(
      this.productResource.value()!.filter(product =>
        product.name.toLowerCase().includes(query)
      )
    );
  }

  addSaleDetail(): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Venta creada',
      detail: 'La venta ha sido creada exitosamente',
      life: 3000, // duración en milisegundos
      key: 'global-toast'
    });

    return;
    if (!this.selectedProduct) return;

    if (!this.canAddProduct()) return;

    const detail = this.fb.group({
      productId: [this.selectedProduct()?.id],
      productName: [this.selectedProduct()?.name],
      stock: [this.selectedProduct()?.stock],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [this.selectedProduct()?.price],
      subtotal: [this.selectedProduct()?.price]
    });

    this.saleDetails.push(detail);
    this.calculateTotal();
    this.selectedProduct.set(undefined);
  }

  removeSaleDetail(index: number): void {
    this.saleDetails.removeAt(index);
    this.calculateTotal();
  }

  updateSubtotal(index: number): void {
    const detail = this.saleDetails.at(index);
    const quantity = detail.get('quantity')?.value || 0;
    const unitPrice = detail.get('unitPrice')?.value || 0;
    detail.patchValue({ subtotal: quantity * unitPrice });
    this.calculateTotal();
  }

  private calculateTotal(): void {
    const total = this.saleDetails.controls.reduce((sum, detail) => {
      return sum + (detail.get('subtotal')?.value || 0);
    }, 0);
    this.saleForm.patchValue({ totalAmount: total });
  }

  canAddProduct(): boolean {
    const product = this.selectedProduct();
    if (!product) return false;

    if (product.status !== Status.Activo || product.stock <= 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No disponible',
        detail: product.stock <= 0
          ? 'El producto no tiene stock disponible'
          : 'El producto no está activo'
      });
      return false;
    }

    return true;
  }

  onSubmit(): void {
    if (this.saleForm.invalid || this.saleDetails.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor complete todos los campos requeridos'
      });
      return;
    }

    const sale: Sale = this.saleForm.value;
    const selectedSeller: SellerResponse = this.saleForm.get('selectedSeller')?.value;

    console.log(sale)

    const saleCreate: Sale = {
      saleNumber: sale.saleNumber,
      sellerId: selectedSeller.id,
      totalAmount: sale.totalAmount,
      comments: sale.comments,
      saleDetails: sale.saleDetails.map((detail: any) => {
        return {
          productId: detail.productId,
          quantity: detail.quantity,
          unitPrice: detail.unitPrice
        };
      })

    }
    this.saleService.createSale(saleCreate).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Venta creada',
          detail: 'La venta ha sido creada exitosamente'
        })

      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ha ocurrido un error al crear la venta'
        });
      }
    });
  }
}
