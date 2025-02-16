export interface ProductResponse {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
  status: Status;
}

export enum Status {
  Activo = "ACTIVO",
  Agotado = "AGOTADO",
  Inactivo = "INACTIVO",
}
