import React from 'react';
import { Car } from '../types/models';
import { Link } from 'react-router-dom';

interface CarCardProps {
  car: Car;
}

export const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const statusColors = {
    AVAILABLE: 'bg-green-100 text-green-800',
    SOLD: 'bg-red-100 text-red-800',
    PENDING: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="h-48 overflow-hidden">
        {car.images && car.images.length > 0 ? (
          <img 
            src={car.images[0]} 
            alt={`${car.year} ${car.make} ${car.model}`} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-gray-800">{car.year} {car.make} {car.model}</h3>
          {car.status && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[car.status]}`}>
              {car.status}
            </span>
          )}
        </div>
        <div className="flex justify-between mb-3">
          <span className="text-lg font-bold text-blue-600">${car.price.toLocaleString()}</span>
          <span className="text-gray-600">{car.mileage.toLocaleString()} miles</span>
        </div>
        <p className="text-gray-600 mb-4 line-clamp-2">{car.description}</p>
        <Link 
          to={`/cars/${car.id}`} 
          className="block w-full text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};
