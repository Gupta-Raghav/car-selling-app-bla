import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCars } from '../hooks/useCars';
import { useSellers } from '../hooks/useSellers';
import { useAuthenticator } from '@aws-amplify/ui-react';

export const SellCarPage: React.FC = () => {
  const navigate = useNavigate();
  const { createCar } = useCars();
  const { createSeller, sellers } = useSellers();
  const { user } = useAuthenticator((context) => [context.user]);
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [sellerData, setSellerData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  const [carData, setCarData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    description: '',
    images: ['']
  });
  
  const handleSellerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSellerData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCarChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCarData(prev => ({ 
      ...prev, 
      [name]: name === 'year' || name === 'price' || name === 'mileage' ? Number(value) : value 
    }));
  };
  
  const handleImageChange = (index: number, value: string) => {
    const newImages = [...carData.images];
    newImages[index] = value;
    setCarData(prev => ({ ...prev, images: newImages }));
  };
  
  const addImageField = () => {
    setCarData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };
  
  const removeImageField = (index: number) => {
    const newImages = carData.images.filter((_, i) => i !== index);
    setCarData(prev => ({ ...prev, images: newImages.length ? newImages : [''] }));
  };
  
  const validateSellerForm = () => {
    if (!sellerData.name.trim()) return "Name is required";
    if (!sellerData.email.trim()) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(sellerData.email)) return "Email is invalid";
    if (!sellerData.phone.trim()) return "Phone number is required";
    return null;
  };
  
  const validateCarForm = () => {
    if (!carData.make.trim()) return "Make is required";
    if (!carData.model.trim()) return "Model is required";
    if (carData.year < 1900 || carData.year > new Date().getFullYear() + 1) return "Invalid year";
    if (carData.price <= 0) return "Price must be greater than 0";
    if (carData.mileage < 0) return "Mileage cannot be negative";
    return null;
  };
  
  const handleNextStep = () => {
    const error = validateSellerForm();
    if (error) {
      setError(error);
      return;
    }
    
    setError(null);
    setStep(2);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const error = validateCarForm();
    if (error) {
      setError(error);
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Create or find seller
      let sellerId;
      const existingSeller = sellers.find(s => s.email === sellerData.email);
      
      if (existingSeller) {
        sellerId = existingSeller.id;
      } else {
        const newSeller = await createSeller(sellerData);
        if (!newSeller) throw new Error("Failed to create seller profile");
        sellerId = newSeller.id;
      }
      
      // Create car listing
      const filteredImages = carData.images.filter(img => img.trim() !== '');
      const newCar = await createCar({
        ...carData,
        images: filteredImages.length > 0 ? filteredImages : undefined,
        status: "AVAILABLE",
        sellerId
      });
      
      if (!newCar) throw new Error("Failed to create car listing");
      
      // Redirect to the new car listing
      navigate(`/cars/${newCar.id}`);
      
    } catch (err) {
      console.error("Error creating listing:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Redirect if not authenticated
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Sign In Required</h2>
          <p className="text-gray-600 mb-6 text-center">
            You need to sign in before you can list a car for sale.
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sell Your Car</h2>
        
        {/* Progress Steps */}
        <div className="flex mb-8">
          <div className={`flex-1 text-center ${step === 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
            <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 ${step === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
              1
            </div>
            <span>Seller Information</span>
          </div>
          <div className={`flex-1 text-center ${step === 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
            <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 ${step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
              2
            </div>
            <span>Car Details</span>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {step === 1 && (
          <form>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={sellerData.name}
                onChange={handleSellerChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={sellerData.email}
                onChange={handleSellerChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={sellerData.phone}
                onChange={handleSellerChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleNextStep}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            </div>
          </form>
        )}
        
        {step === 2 && (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-1">
                  Make *
                </label>
                <input
                  type="text"
                  id="make"
                  name="make"
                  value={carData.make}
                  onChange={handleCarChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                  Model *
                </label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={carData.model}
                  onChange={handleCarChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                  Year *
                </label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  value={carData.year}
                  onChange={handleCarChange}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={carData.price}
                  onChange={handleCarChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="mileage" className="block text-sm font-medium text-gray-700 mb-1">
                  Mileage *
                </label>
                <input
                  type="number"
                  id="mileage"
                  name="mileage"
                  value={carData.mileage}
                  onChange={handleCarChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={carData.description}
                onChange={handleCarChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images (URLs)
              </label>
              
              {carData.images.map((image, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeImageField(index)}
                    className="ml-2 bg-red-100 text-red-600 px-3 py-2 rounded-md hover:bg-red-200 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addImageField}
                className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                + Add Another Image
              </button>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
              >
                {isSubmitting ? 'Submitting...' : 'List My Car'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
