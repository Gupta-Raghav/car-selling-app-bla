import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '../../amplify/data/resource';
import { Car } from '../types/models';
import { InquiryForm } from './InquiryForm';

const client = generateClient<Schema>();

export const CarDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [showInquiryForm, setShowInquiryForm] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const { data, errors } = await client.models.Car.get({ id });
        
        if (errors) {
          throw new Error(errors[0].message);
        }
        
        setCar(data);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching car details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error || !car) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{error ? error.message : 'Car not found'}</span>
      <button 
        className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => navigate('/cars')}
      >
        Back to Cars
      </button>
    </div>
  );

  const statusColors = {
    AVAILABLE: 'bg-green-100 text-green-800',
    SOLD: 'bg-red-100 text-red-800',
    PENDING: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/2">
          <div className="relative h-64 md:h-96">
            {car.images && car.images.length > 0 ? (
              <img 
                src={car.images[activeImage]} 
                alt={`${car.year} ${car.make} ${car.model}`} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>
          
          {car.images && car.images.length > 1 && (
            <div className="flex overflow-x-auto p-2 space-x-2">
              {car.images.map((img, index) => (
                <button 
                  key={index} 
                  className={`w-20 h-20 flex-shrink-0 ${activeImage === index ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setActiveImage(index)}
                >
                  <img 
                    src={img} 
                    alt={`${car.make} ${car.model} thumbnail ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="md:w-1/2 p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">{car.year} {car.make} {car.model}</h1>
            {car.status && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[car.status]}`}>
                {car.status}
              </span>
            )}
          </div>
          
          <div className="text-2xl font-bold text-blue-600 mb-6">${car.price.toLocaleString()}</div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Mileage</h3>
              <p className="text-lg font-medium text-gray-900">{car.mileage.toLocaleString()} miles</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Year</h3>
              <p className="text-lg font-medium text-gray-900">{car.year}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Make</h3>
              <p className="text-lg font-medium text-gray-900">{car.make}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Model</h3>
              <p className="text-lg font-medium text-gray-900">{car.model}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
            <p className="text-gray-700">{car.description}</p>
          </div>
          
          {car.status === 'AVAILABLE' && (
            <div className="flex space-x-4">
              <button 
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
                onClick={() => setShowInquiryForm(true)}
              >
                Contact Seller
              </button>
            </div>
          )}
        </div>
      </div>
      
      {showInquiryForm && (
        <div className="p-6 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Interested in this car?</h2>
          <InquiryForm carId={car.id} onSubmitSuccess={() => setShowInquiryForm(false)} />
        </div>
      )}
    </div>
  );
};
