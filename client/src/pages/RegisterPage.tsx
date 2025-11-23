import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const backgroundImages = [
  'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=600', // Bright beach
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&h=400', // Mountain lake
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300', // Modern glass building
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300&h=500', // Colorful flowers
  'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=400', // Tropical fruits
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300', // Forest trees
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=500', // Tropical beach
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=300&h=400', // Contemporary building
  'https://images.unsplash.com/photo-1490682143684-14369e18dce8?w=400&h=300', // Citrus fruits
  'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=300&h=500', // Modern architecture
  'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400&h=400', // Nature flowers meadow
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300', // Mountain landscape
  'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400&h=600', // Blue water lake
  'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=300&h=400', // Palm trees
  'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300', // Berries fruits
  'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=300&h=500', // City buildings skyline
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=400', // Bright flowers garden
  'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=300&h=300', // Lake reflection
  'https://images.unsplash.com/photo-1610878180933-123728745d22?w=400&h=500', // Fresh tropical fruits
  'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=300&h=400', // Urban architecture
];

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    birthdate: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordWarnings, setPasswordWarnings] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Create doubled images for seamless loop
  const scrollingImages = [...backgroundImages, ...backgroundImages];

  const validatePassword = (password: string) => {
    const warnings: string[] = [];
    if (password.length < 8) warnings.push('Use 8 or more characters');
    if (!/[a-z]/.test(password)) warnings.push('Use lowercase letter');
    if (!/[A-Z]/.test(password)) warnings.push('Use uppercase letter');
    if (!/[0-9]/.test(password)) warnings.push('Use number');
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) warnings.push('Use symbol');
    return warnings;
  };

  const handlePasswordChange = (value: string) => {
    setFormData({ ...formData, password: value });
    setPasswordWarnings(validatePassword(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (passwordWarnings.length > 0) {
      setError('Please meet all password requirements');
      return;
    }

    setLoading(true);
    try {
      await register({
        email: formData.email,
        password: formData.password,
        username: formData.email.split('@')[0],
        firstName: formData.name.split(' ')[0] || formData.name,
        lastName: formData.name.split(' ')[1] || '',
      });
      navigate('/');
    } catch (err: any) {
      if (err.message === 'EMAIL_EXISTS') {
        setError('Email already in use');
      } else {
        setError('Failed to create account');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      {/* Scrolling Background Container */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div
          className="auth-background-scroll"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gridAutoRows: 'minmax(150px, 250px)',
            gap: '8px',
            opacity: 0.25,
            height: '200vh',
          }}
        >
          {scrollingImages.map((img, idx) => (
            <div
              key={idx}
              style={{
                backgroundImage: `url(${img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '16px',
                gridRow: `span ${Math.floor(Math.random() * 2) + 1}`,
                gridColumn: `span ${Math.floor(Math.random() * 2) + 1}`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Signup Card */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            background: 'white',
            borderRadius: '32px',
            padding: '48px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            width: '100%',
            maxWidth: '480px',
            pointerEvents: 'auto',
          }}
        >
          <div className="text-center mb-4">
            <div style={{ color: '#e60023', fontSize: '48px', fontWeight: '700', marginBottom: '16px' }}>
              Pinterest
            </div>
            <h4 className="mb-2">Welcome to Pinterest</h4>
            <p className="text-muted">Find new ideas to try</p>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                style={{
                  borderRadius: '16px',
                  padding: '14px 16px',
                  border: '2px solid #ccc',
                  fontSize: '16px',
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <div style={{ position: 'relative' }}>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  required
                  style={{
                    borderRadius: '16px',
                    padding: '14px 16px',
                    paddingRight: '45px',
                    border: '2px solid #ccc',
                    fontSize: '16px',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                  }}
                >
                  {showPassword ? <EyeOff size={20} color="#767676" /> : <Eye size={20} color="#767676" />}
                </button>
              </div>
              {formData.password && passwordWarnings.length > 0 && (
                <div
                  style={{
                    marginTop: '8px',
                    padding: '12px',
                    backgroundColor: '#fee',
                    borderRadius: '12px',
                    border: '1px solid #dc3545',
                  }}
                >
                  <small style={{ color: '#dc3545', fontWeight: '600' }}>
                    Password requirements:
                  </small>
                  <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px' }}>
                    {passwordWarnings.map((warning, idx) => (
                      <li key={idx} style={{ fontSize: '12px', color: '#dc3545' }}>
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Birthdate</Form.Label>
              <Form.Control
                type="text"
                placeholder="mm/dd/yyyy"
                value={formData.birthdate}
                onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                style={{
                  borderRadius: '16px',
                  padding: '14px 16px',
                  border: '2px solid #ccc',
                  fontSize: '16px',
                }}
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100 mb-3"
              disabled={loading || passwordWarnings.length > 0}
              style={{
                backgroundColor: '#e60023',
                borderColor: '#e60023',
                borderRadius: '24px',
                padding: '14px',
                fontSize: '16px',
                fontWeight: '600',
              }}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Creating account...
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </Form>

          <div className="text-center">
            <small className="text-muted">OR</small>
          </div>

          <div className="text-center mt-3">
            <p className="text-muted">
              Already a member?{' '}
              <Link to="/login" style={{ color: '#e60023', fontWeight: '600', textDecoration: 'none' }}>
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;