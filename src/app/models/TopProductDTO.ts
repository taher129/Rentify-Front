export interface TopProductDTO {
  productId: number;
  reservationCount: number;
}

export interface ProductDTO {
  id: number;
  name: string;
  price: number;
  productImage: string;
  categoryName: string;
}

export interface CombinedProductDTO extends TopProductDTO, ProductDTO {}
