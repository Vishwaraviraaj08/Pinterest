import React, { useState, useEffect } from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';
import { Pin } from '../types';
import { contentService } from '../services/contentService';
import PinCard from '../components/PinCard';

const SponsoredPage: React.FC = () => {
    const [pins, setPins] = useState<Pin[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadSponsoredPins();
    }, []);

    const loadSponsoredPins = async () => {
        try {
            const data = await contentService.getSponsoredPins();
            setPins(data);
        } catch (err) {
            console.error('Failed to load sponsored pins:', err);
            setError('Failed to load sponsored pins. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <Spinner animation="border" variant="danger" />
            </div>
        );
    }

    return (
        <Container fluid className="py-4">
            <h2 className="mb-4 fw-bold text-center">Advertising Campaigns</h2>
            <p className="text-center text-muted mb-5">Discover relevant products, services, and promotions from our partners.</p>

            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && pins.length === 0 && !error && (
                <div className="text-center text-muted mt-5">
                    <h4>No active campaigns at the moment.</h4>
                    <p>Check back later for more sponsored content.</p>
                </div>
            )}

            <div className="masonry-grid">
                {pins.map(pin => (
                    <PinCard key={pin.id} pin={pin} />
                ))}
            </div>
        </Container>
    );
};

export default SponsoredPage;
