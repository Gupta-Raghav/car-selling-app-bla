import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '../../amplify/data/resource';
import { Seller } from '../types/models';

const client = generateClient<Schema>();

export function useSellers() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const { data } = await client.models.Seller.list();
      setSellers(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createSeller = async (seller: Omit<Seller, 'id'>) => {
    try {
      const { data } = await client.models.Seller.create(seller);
      setSellers(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err as Error);
      return null;
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  return {
    sellers,
    loading,
    error,
    createSeller,
    refreshSellers: fetchSellers
  };
}
