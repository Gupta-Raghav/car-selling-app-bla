import { Car, Seller, Inquiry } from '../types/models';

export const mockSellers: Omit<Seller, 'id'>[] = [
  {
    name: "John Smith",
    email: "john@example.com",
    phone: "555-123-4567"
  },
  {
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "555-987-6543"
  },
  {
    name: "Mike Williams",
    email: "mike@example.com",
    phone: "555-456-7890"
  }
];

export const mockCars: Omit<Car, 'id' | 'sellerId'>[] = [
  {
    make: "Toyota",
    model: "Camry",
    year: 2020,
    price: 22500,
    mileage: 15000,
    description: "Well-maintained sedan with excellent fuel economy. One owner, no accidents.",
    status: "AVAILABLE",
    images: ["https://images.unsplash.com/photo-1550355291-bbee04a92027"]
  },
  {
    make: "Honda",
    model: "CR-V",
    year: 2019,
    price: 24800,
    mileage: 28500,
    description: "Spacious SUV with all-wheel drive. Perfect for families.",
    status: "AVAILABLE",
    images: ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf"]
  },
  {
    make: "Ford",
    model: "Mustang",
    year: 2018,
    price: 31000,
    mileage: 20000,
    description: "Powerful sports car with V8 engine. Excellent condition.",
    status: "PENDING",
    images: ["https://images.unsplash.com/photo-1584345604476-8ec5f452d1f8"]
  },
  {
    make: "Tesla",
    model: "Model 3",
    year: 2021,
    price: 45000,
    mileage: 8000,
    description: "Electric sedan with autopilot features. Like new condition.",
    status: "AVAILABLE",
    images: ["https://images.unsplash.com/photo-1560958089-b8a1929cea89"]
  },
  {
    make: "Chevrolet",
    model: "Silverado",
    year: 2017,
    price: 28500,
    mileage: 42000,
    description: "Reliable pickup truck with towing package. Well maintained.",
    status: "SOLD",
    images: ["https://images.unsplash.com/photo-1595758228697-a5e8c1af4b9c"]
  }
];
