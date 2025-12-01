import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import './LandingPage.css';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);

    const backgroundImages = [
        '/images/landing/beach.jpg',
        '/images/landing/mountain.jpg',
        '/images/landing/building.jpg',
        '/images/landing/flowers.jpg',
        '/images/landing/fruits.jpg',
        '/images/landing/forest.jpg',
        '/images/landing/tropical.jpg',
        '/images/landing/contemporary.jpg',
        '/images/landing/citrus.jpg',
        '/images/landing/architecture.jpg',
        '/images/landing/meadow.jpg',
        '/images/landing/landscape.jpg',
        '/images/landing/lake.jpg',
        '/images/landing/palms.jpg',
        '/images/landing/berries.jpg',
        '/images/landing/skyline.jpg',
        '/images/landing/garden.jpg',
        '/images/landing/reflection.jpg',
        '/images/landing/tropical-fruits.jpg',
        '/images/landing/urban.jpg',
    ];

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <div className="landing-page">
            {/* Masonry Background */}
            <div className="masonry-background">
                <div className="masonry-column">
                    {backgroundImages.slice(0, 5).map((img, idx) => (
                        <div key={idx} className="masonry-item">
                            <img src={img} alt="" loading="lazy" />
                        </div>
                    ))}
                </div>
                <div className="masonry-column">
                    {backgroundImages.slice(5, 10).map((img, idx) => (
                        <div key={idx} className="masonry-item">
                            <img src={img} alt="" loading="lazy" />
                        </div>
                    ))}
                </div>
                <div className="masonry-column">
                    {backgroundImages.slice(10, 15).map((img, idx) => (
                        <div key={idx} className="masonry-item">
                            <img src={img} alt="" loading="lazy" />
                        </div>
                    ))}
                </div>
                <div className="masonry-column">
                    {backgroundImages.slice(15, 20).map((img, idx) => (
                        <div key={idx} className="masonry-item">
                            <img src={img} alt="" loading="lazy" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Overlay */}
            <div className="landing-overlay"></div>

            {/* Hero Content */}
            <Container className={`landing-hero ${isLoaded ? 'fade-in' : ''}`}>
                <div className="hero-content">
                    <h1 className="hero-title text-danger display-1">
                        Pinterest
                    </h1>
                    <h1 className="hero-title display-5">
                        Get your next &nbsp;&nbsp;

                        <span className="gradient-text">creative idea</span>
                    </h1>

                    <div className="hero-buttons">
                        <Button
                            variant="danger"
                            size="lg"
                            className="cta-button primary-cta"
                            onClick={() => navigate('/register')}
                        >
                            Sign up
                        </Button>
                        <Button
                            variant="light"
                            size="lg"
                            className="cta-button secondary-cta"
                            onClick={() => navigate('/login')}
                        >
                            Log in
                        </Button>
                    </div>
                    <p className="hero-tagline">
                        "Where ideas come to life"
                    </p>
                </div>
            </Container>
        </div>
    );
};

export default LandingPage;
