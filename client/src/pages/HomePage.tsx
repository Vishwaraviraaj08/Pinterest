import React from 'react';
import { Container, Spinner } from 'react-bootstrap';
import PinCard from '../components/PinCard';
import { mockPins } from '../utils/mockData';
import { Pin } from '../types';

const HomePage: React.FC = () => {
  // In production, this would fetch pins from the Content Microservice
  // Add some sponsored pins to the feed
  const sponsoredPins: Pin[] = [
    {
      ...mockPins[2],
      id: 'sponsored-1',
      title: 'Sponsored: Premium Kitchen Collection',
      isSponsored: true,
    },
    {
      ...mockPins[7],
      id: 'sponsored-2',
      title: 'Sponsored: New Fashion Line',
      isSponsored: true,
    },
  ];

  // Mix sponsored pins with regular pins
  const allPins = [...mockPins];
  allPins.splice(3, 0, sponsoredPins[0]);
  allPins.splice(8, 0, sponsoredPins[1]);

  if (!allPins) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="danger" />
      </div>
    );
  }

  return (
    <Container fluid style={{ padding: '20px' }}>
      <div className="masonry-grid">
        {allPins.map((pin) => (
          <PinCard key={pin.id} pin={pin} />
        ))}
      </div>
    </Container>
  );
};

export default HomePage;