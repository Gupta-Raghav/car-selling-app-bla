import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '../amplify/data/resource';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { CarList } from './components/CarList';
import { CarDetail } from './components/CarDetail';
import { SellCarPage } from './pages/SellCarPage';
import { mockCars, mockSellers } from './data/mockData';

const client = generateClient<Schema>();

function App() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedingComplete, setSeedingComplete] = useState(false);
  const [seedingError, setSeedingError] = useState<Error | null>(null);

  useEffect(() => {
    const seedDatabase = async () => {
      // Check if we've already seeded the database in this session
      const hasSeeded = sessionStorage.getItem('dbSeeded');
      if (hasSeeded === 'true') {
        console.log('Database already seeded in this session');
        return;
      }

      setIsSeeding(true);
      setSeedingError(null);

      try {
        // First check if we already have data to avoid duplicates
        const { data: existingCars, errors: listErrors } = await client.models.Car.list({
          limit: 1
        });

        if (listErrors) {
          throw new Error(`Error checking existing cars: ${listErrors[0].message}`);
        }

        // If we already have data, don't seed
        if (existingCars.length > 0) {
          console.log('Database already has data, skipping seed');
          sessionStorage.setItem('dbSeeded', 'true');
          setIsSeeding(false);
          setSeedingComplete(true);
          return;
        }

        console.log('Seeding database with mock data...');

        // First create sellers
        const sellerIds = [];
        for (const seller of mockSellers) {
          const { data: newSeller, errors: sellerErrors } = await client.models.Seller.create(seller);
          
          if (sellerErrors) {
            throw new Error(`Error creating seller: ${sellerErrors[0].message}`);
          }
          
          sellerIds.push(newSeller.id);
        }

        // Then create cars with seller IDs
        for (let i = 0; i < mockCars.length; i++) {
          const car = mockCars[i];
          const sellerId = sellerIds[i % sellerIds.length]; // Distribute cars among sellers
          
          const { errors: carErrors } = await client.models.Car.create({
            ...car,
            sellerId
          });

          if (carErrors) {
            throw new Error(`Error creating car: ${carErrors[0].message}`);
          }
        }

        console.log(`Successfully seeded database with ${mockCars.length} cars and ${mockSellers.length} sellers`);
        sessionStorage.setItem('dbSeeded', 'true');
        setSeedingComplete(true);
      } catch (error) {
        console.error('Error seeding database:', error);
        setSeedingError(error instanceof Error ? error : new Error('Unknown error during seeding'));
      } finally {
        setIsSeeding(false);
      }
    };

    seedDatabase();
  }, []);

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <Router>
          <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            
            <main className="flex-grow container mx-auto px-4 py-8">
              {isSeeding && (
                <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded-md">
                  Initializing demo data...
                </div>
              )}
              
              {seedingError && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                  Error initializing data: {seedingError.message}
                </div>
              )}
              
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/cars" element={<CarList />} />
                <Route path="/cars/:id" element={<CarDetail />} />
                <Route path="/sell" element={<SellCarPage />} />
              </Routes>
            </main>
            
            <Footer />
          </div>
        </Router>
      )}
    </Authenticator>
  );
}

export default App;
