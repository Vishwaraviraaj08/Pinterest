import React, { useEffect } from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';
import PinCard from '../components/PinCard';
import { usePins } from '../contexts/PinContext';

const HomePage: React.FC = () => {
  const { pins, isLoading, error, fetchPublicPins } = usePins();

  useEffect(() => {
    fetchPublicPins();
  }, [fetchPublicPins]);

  if (isLoading && pins.length === 0) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="danger" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          Error loading pins: {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid style={{ padding: '20px' }}>
      {pins.length === 0 && !isLoading ? (
        <div className="text-center mt-5">
          <h3>No pins found</h3>
          <p>Be the first to create a pin!</p>
        </div>
      ) : (
        <div className="masonry-grid">
          {pins.map((pin) => (
            <PinCard key={pin.id} pin={pin} />
          ))}
        </div>
      )}
    </Container>
  );
};

export default HomePage;