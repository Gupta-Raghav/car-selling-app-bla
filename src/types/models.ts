export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  description?: string;
  status?: "AVAILABLE" | "SOLD" | "PENDING";
  images?: string[];
  sellerId: string;
  seller?: Seller;
}

export interface Seller {
  id: string;
  name: string;
  email: string;
  phone: string;
  cars?: Car[];
}

export interface Inquiry {
  id: string;
  message: string;
  carId: string;
  car?: Car;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  status?: "NEW" | "RESPONDED" | "CLOSED";
}

export type CreateCarInput = Omit<Car, 'id' | 'seller'>;
export type UpdateCarInput = Partial<Omit<Car, 'id' | 'seller'>>;
