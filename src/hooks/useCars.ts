import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '../../amplify/data/resource';
import { Car, CreateCarInput, UpdateCarInput } from '../types/models';

const client = generateClient<Schema>();

export function useCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const { data } = await client.models.Car.list();
      setCars(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createCar = async (car: CreateCarInput) => {
    try {
      const { data } = await client.models.Car.create(car);
      setCars(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err as Error);
      return null;
    }
  };

  const updateCar = async (id: string, car: UpdateCarInput) => {
    try {
      const { data } = await client.models.Car.update({
        id,
        ...car
      });
      setCars(prev => prev.map(c => c.id === id ? data : c));
      return data;
    } catch (err) {
      setError(err as Error);
      return null;
    }
  };

  const deleteCar = async (id: string) => {
    try {
      await client.models.Car.delete({ id });
      setCars(prev => prev.filter(c => c.id !== id));
      return true;
    } catch (err) {
      setError(err as Error);
      return false;
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return {
    cars,
    loading,
    error,
    createCar,
    updateCar,
    deleteCar,
    refreshCars: fetchCars
  };
}
