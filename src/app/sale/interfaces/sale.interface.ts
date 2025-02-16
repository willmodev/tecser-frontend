import { ProductResponse } from '../../product/interfaces/product.interface';
import { SellerResponse } from '../../seller/interfaces/seller.interface';

export interface Sale {
  saleNumber: string;
  sellerId: number;
  totalAmount: number;
  comments: string;
  saleDetails: SaleDetail[];
}

export interface SaleDetail {
  productId: number;
  quantity: number;
  unitPrice: number;
}
export interface SaleResponse {
  id: number;
  saleNumber: string;
  date: Date;
  totalAmount: number;
  comments: string;
  seller: SellerResponse;
  products: ProductResponse[];
  saleDetails: SaleDetail[];
}

export interface SaleDetailResponse {
  id: number;
  saleId: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}


