import React, { useState } from 'react';
import { useInquiries } from '../hooks/useInquiries';

interface InquiryFormProps {
  carId: string;
  onSubmitSuccess: () => void;
}

export const InquiryForm: React.FC<InquiryFormProps> = ({ carId, onSubmitSuccess }) => {
  const { createInquiry } = useInquiries();
  const [formData, setFormData] = useState({
    buyerName: '',
    buyerEmail: '',
    buyerPhone: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.buyerName.trim()) {
      newErrors.buyerName = 'Name is required';
    }
    
    if (!formData.buyerEmail.trim()) {
      newErrors.buyerEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.buyerEmail)) {
      newErrors.buyerEmail = 'Email is invalid';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await createInquiry({
        carId,
        buyerName: formData.buyerName,
        buyerEmail: formData.buyerEmail,
        buyerPhone: formData.buyerPhone || undefined,
        message: formData.message,
        status: 'NEW'
      });
      
      if (result) {
        setSubmitSuccess(true);
        setTimeout(() => {
          onSubmitSuccess();
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Success! </strong>
        <span className="block sm:inline">Your inquiry has been sent to the seller. They will contact you soon.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="buyerName" className="block text-sm font-medium text-gray-700">
          Your Name *
        </label>
        <input
          type="text"
          id="buyerName"
          name="buyerName"
          value={formData.buyerName}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            errors.buyerName ? 'border-red-300' : ''
          }`}
        />
        {errors.buyerName && <p className="mt-1 text-sm text-red-600">{errors.buyerName}</p>}
      </div>
      
      <div>
        <label htmlFor="buyerEmail" className="block text-sm font-medium text-gray-700">
          Your Email *
        </label>
        <input
          type="email"
          id="buyerEmail"
          name="buyerEmail"
          value={formData.buyerEmail}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            errors.buyerEmail ? 'border-red-300' : ''
          }`}
        />
        {errors.buyerEmail && <p className="mt-1 text-sm text-red-600">{errors.buyerEmail}</p>}
      </div>
      
      <div>
        <label htmlFor="buyerPhone" className="block text-sm font-medium text-gray-700">
          Your Phone (optional)
        </label>
        <input
          type="tel"
          id="buyerPhone"
          name="buyerPhone"
          value={formData.buyerPhone}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            errors.message ? 'border-red-300' : ''
          }`}
          placeholder="I'm interested in this car. Please contact me with more information."
        ></textarea>
        {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
      </div>
      
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
        >
          {isSubmitting ? 'Sending...' : 'Send Inquiry'}
        </button>
      </div>
    </form>
  );
};
