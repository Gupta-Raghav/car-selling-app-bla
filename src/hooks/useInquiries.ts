import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '../../amplify/data/resource';
import { Inquiry } from '../types/models';

const client = generateClient<Schema>();

export function useInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const { data } = await client.models.Inquiry.list();
      setInquiries(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createInquiry = async (inquiry: Omit<Inquiry, 'id'>) => {
    try {
      const { data } = await client.models.Inquiry.create(inquiry);
      setInquiries(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err as Error);
      return null;
    }
  };

  const updateInquiryStatus = async (id: string, status: "NEW" | "RESPONDED" | "CLOSED") => {
    try {
      const { data } = await client.models.Inquiry.update({
        id,
        status
      });
      setInquiries(prev => prev.map(i => i.id === id ? data : i));
      return data;
    } catch (err) {
      setError(err as Error);
      return null;
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  return {
    inquiries,
    loading,
    error,
    createInquiry,
    updateInquiryStatus,
    refreshInquiries: fetchInquiries
  };
}
