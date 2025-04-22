export interface Reservation {
  id: number | null;
  status: 'upcoming' | 'completed' | 'canceled' | 'rejected' | 'confirmed' | 'pending';
  productId: number | null;
  userId: number | null;
  couponName: string;
  couponPrice: number;
  rentingDuration: number;
  totalPrice: number | null;
  startDate: Date;
  endDate: Date;
}

export interface SpecialRequest {
  id: string;
  label: string;
  price: number;
  checked: boolean;
}
