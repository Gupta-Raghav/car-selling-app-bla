import React, { useState } from 'react';
import { useCars } from '../hooks/useCars';
import { CarCard } from './CarCard';

export const CarList: React.FC = () => {
  const { cars, loading, error } = useCars();
  const [filter, setFilter] = useState('ALL');

  const filteredCars = filter === 'ALL' 
    ? cars 
    : cars.filter(car => car.status === filter);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{error.message}</span>
    </div>
  );

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Available Cars</h2>
        <div className="flex space-x-2">
          <button 
            className={`px-4 py-2 rounded-md ${filter === 'ALL' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setFilter('ALL')}
          >
            All
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${filter === 'AVAILABLE' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setFilter('AVAILABLE')}
          >
            Available
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${filter === 'PENDING' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setFilter('PENDING')}
          >
            Pending
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${filter === 'SOLD' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setFilter('SOLD')}
          >
            Sold
          </button>
        </div>
      </div>

      {filteredCars.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No cars found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map(car => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
};
