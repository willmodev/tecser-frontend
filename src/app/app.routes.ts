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
    path: '**',
    redirectTo: 'admin'
  }
];
