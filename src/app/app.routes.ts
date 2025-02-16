import { Routes } from '@angular/router';
import { HomePageComponent } from './shared/pages/home-page/home-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent
  },
  {
    path: 'products',
    loadChildren: () => import('./product/product.routes')
  },
  {
    path: 'sellers',
    loadChildren: () => import('./seller/seller.routes')
  },
  {
    path: 'sales',
    loadChildren: () => import('./sale/sale.routes')
  },
  {
    path: '**',
    redirectTo: 'admin'
  }
];
