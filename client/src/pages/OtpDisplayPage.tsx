import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';

const OtpDisplayPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const otp = searchParams.get('otp');

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
            <Card style={{ width: '100%', maxWidth: '400px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <Card.Body className="text-center p-5">
                    <h4 className="mb-4">Your OTP Code</h4>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', letterSpacing: '4px', color: '#e60023', marginBottom: '24px' }}>
                        {otp || '------'}
                    </div>
                    <p className="text-muted">
                        Use this code to reset your password. Do not share this code with anyone.
                    </p>
                    <p className="text-muted small mt-4">
                        (This is a simulation page since we don't have SMS integration)
                    </p>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default OtpDisplayPage;
