import { Routes } from '@angular/router';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { ProductLayoutComponent } from './layouts/product-layout/product-layout.component';
import { ProductFormPageComponent } from './pages/product-form-page/prodcut-form-page.component';


const productRoutes: Routes = [
  {
    path: '',
    component: ProductLayoutComponent,
    children: [
      {
        path: '',
        component: MainPageComponent
      },
      {
        path: 'register',
        component: ProductFormPageComponent
      },
      {
        path: 'edit/:id',
        component: ProductFormPageComponent
      }
    ]
  }
];

export default productRoutes;
