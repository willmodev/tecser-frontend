import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { SellerResponse } from '../../interfaces/seller.interface';
import { SellerService } from '../../services/seller.service';

@Component({
  selector: 'app-seller-form-page',
  templateUrl: './seller-form-page.component.html',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    ButtonModule
  ]
})
export class SellerFormPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private sellerService = inject(SellerService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private sellerId?: string;
  public isEditing = false;

  statusOptions = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false }
  ];

  sellerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    documentId: ['', [Validators.required]],
    isActive: [true, Validators.required]
  });

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.sellerId = params['id'];
        this.isEditing = true;
        this.loadSeller();
      }
    });
  }

  private loadSeller(): void {
    if (!this.sellerId) return;

    this.sellerService.getSellerById(this.sellerId)
      .subscribe({
        next: (seller) => {
          this.sellerForm.patchValue({
            name: seller.name,
            email: seller.email,
            phone: seller.phone,
            documentId: seller.documentId,
            isActive: seller.isActive
          });
        },
        error: (error) => {
          console.error('Error loading seller:', error);
          this.router.navigate(['/sellers']);
        }
      });
  }

  onSubmit(): void {
    if (this.sellerForm.valid) {
      const seller: Omit<SellerResponse, 'id' | 'registrationDate'> = this.sellerForm.value;

      if (this.isEditing && this.sellerId) {
        this.sellerService.updateSeller(this.sellerId, seller)
          .subscribe({
            next: () => {
              this.router.navigate(['/sellers']);
            },
            error: (error) => {
              console.error('Error updating seller:', error);
            }
          });
      } else {
        this.sellerService.createSeller(seller)
          .subscribe({
            next: () => {
              this.router.navigate(['/sellers']);
            },
            error: (error) => {
              console.error('Error creating seller:', error);
            }
          });
      }
    }
  }

  onCancel(): void {
    this.sellerForm.reset();
    this.router.navigate(['/sellers']);
  }
}
