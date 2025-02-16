import { Routes } from '@angular/router';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { SaleLayoutComponent } from './layouts/sale-layout/sale-layout.component';
import { SaleFormPageComponent } from './pages/sale-form-page/sale-form-page.component';


const saleRoutes: Routes = [
  {
    path: '',
    component: SaleLayoutComponent,
    children: [
      {
        path: '',
        component: MainPageComponent
      },
      {
        path: 'register',
        component: SaleFormPageComponent
      },
      {
        path: 'edit/:id',
        component: SaleFormPageComponent
      }
    ]
  }
];

export default saleRoutes;
