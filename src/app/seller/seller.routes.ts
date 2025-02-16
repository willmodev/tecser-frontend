import { Routes } from '@angular/router';

import { MainPageComponent } from './pages/main-page/main-page.component';
import { SellerLayoutComponent } from './layouts/seller-layout/seller-layout.component';
import { SellerFormPageComponent } from './pages/seller-form-page/seller-form-page.component';


const sellerRoutes: Routes = [
  {
    path: '',
    component: SellerLayoutComponent,
    children: [
      {
        path: '',
        component: MainPageComponent
      },
      {
        path: 'register',
        component: SellerFormPageComponent
      },
      {
        path: 'edit/:id',
        component: SellerFormPageComponent
      }
    ]
  }
]

export default sellerRoutes;
