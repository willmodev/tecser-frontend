import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductResponse, Status } from '../../interfaces/product.interface';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { Textarea } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './product-form-page.component.html',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    Textarea,
    DropdownModule,
    ButtonModule
  ]
})
export class ProductFormPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private productId?: string;
  public isEditing = false;

  statusOptions = [
    { label: 'Activo', value: Status.Activo },
    { label: 'Inactivo', value: Status.Inactivo },
    { label: 'Agotado', value: Status.Agotado }
  ];

  productForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    price: [null, [Validators.required, Validators.min(0)]],
    stock: [null, [Validators.required, Validators.min(0)]],
    status: [Status.Activo, Validators.required]
  });

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.productId = params['id'];
        this.isEditing = true;
        this.loadProduct();
      }
    });
  }

  private loadProduct(): void {
    if (!this.productId) return;

    this.productService.getProductById(this.productId)
      .subscribe({
        next: (product) => {
          this.productForm.patchValue({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            status: product.status
          });
        },
        error: (error) => {
          console.error('Error loading product:', error);
          this.router.navigate(['/products']);
        }
      });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const product: Omit<ProductResponse, 'id'> = this.productForm.value;

      if (this.isEditing && this.productId) {
        this.productService.updateProduct(this.productId, product)
          .subscribe({
            next: () => {
              this.router.navigate(['/products']);
            },
            error: (error) => {
              console.error('Error updating product:', error);
            }
          });
      } else {
        this.productService.createProduct(product)
          .subscribe({
            next: () => {
              this.router.navigate(['/products']);
            },
            error: (error) => {
              console.error('Error creating product:', error);
            }
          });
      }
    }
  }

  onCancel(): void {
    this.productForm.reset();
    this.router.navigate(['/products']);
  }
}
