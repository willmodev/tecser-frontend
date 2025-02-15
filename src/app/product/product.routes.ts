import { Routes } from '@angular/router';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { ProductLayoutComponent } from './layouts/ProductLayout/ProductLayout.component';

const productRoutes: Routes = [
  {
    path: '',
    component: ProductLayoutComponent,
    children: [
      {
        path: '',
        component: MainPageComponent
      }
    ]
  }
];

export default productRoutes;
