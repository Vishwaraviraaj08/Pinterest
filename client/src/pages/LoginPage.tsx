import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner, ProgressBar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

interface LoginAttempt {
  count: number;
  firstAttemptTime: number;
  lockedUntil: number | null;
}

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

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Login attempt tracking
  const [loginAttempts, setLoginAttempts] = useState<{ count: number; firstAttemptTime: number; lockedUntil: number | null }>(() => {
    const stored = localStorage.getItem('loginAttempts');
    return stored ? JSON.parse(stored) : { count: 0, firstAttemptTime: 0, lockedUntil: null };
  });

  const [remainingTime, setRemainingTime] = useState(0);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  // Create doubled images for seamless loop
  const scrollingImages = [...backgroundImages, ...backgroundImages];

  useEffect(() => {
    if (loginAttempts.lockedUntil) {
      const interval = setInterval(() => {
        const now = Date.now();
        const timeLeft = Math.max(0, (loginAttempts.lockedUntil || 0) - now);
        setRemainingTime(Math.ceil(timeLeft / 1000));

        if (timeLeft === 0) {
          setLoginAttempts({
            count: 0,
            firstAttemptTime: 0,
            lockedUntil: null,
          });
          setError('');
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [loginAttempts.lockedUntil]);

  const checkCircuitBreaker = (): boolean => {
    const now = Date.now();
    if (loginAttempts.lockedUntil && now < loginAttempts.lockedUntil) {
      const secondsLeft = Math.ceil((loginAttempts.lockedUntil - now) / 1000);
      setError(`Too many failed attempts. Please wait ${secondsLeft} seconds.`);
      return false;
    }
    if (loginAttempts.firstAttemptTime && now - loginAttempts.firstAttemptTime > 30000) {
      setLoginAttempts({ count: 0, firstAttemptTime: 0, lockedUntil: null });
    }
    return true;
  };

  const handleFailedLogin = () => {
    const now = Date.now();
    const newCount = loginAttempts.count + 1;
    const firstAttemptTime = loginAttempts.firstAttemptTime || now;

    if (now - firstAttemptTime <= 30000) {
      if (newCount >= 3) {
        const lockedUntil = now + 60000;
        setLoginAttempts({ count: newCount, firstAttemptTime, lockedUntil });
        setRemainingTime(60);
        setError('Too many failed attempts. Account locked for 1 minute.');
      } else {
        setLoginAttempts({ count: newCount, firstAttemptTime, lockedUntil: null });
        setError(`Invalid credentials. ${3 - newCount} attempts remaining.`);
      }
    } else {
      setLoginAttempts({ count: 1, firstAttemptTime: now, lockedUntil: null });
      setError('Invalid email or password.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!checkCircuitBreaker()) return;
    try {
      await login(email, password);
      navigate('/');
      // Successful login will redirect via ProtectedRoute/AuthContext
    } catch (err: any) {
      const newCount = loginAttempts.count + 1;
      let newLockedUntil = null;

      if (newCount >= 5) {
        newLockedUntil = Date.now() + 30000; // Lock for 30 seconds
      }

      const newAttempts = {
        count: newCount,
        firstAttemptTime: loginAttempts.firstAttemptTime || Date.now(),
        lockedUntil: newLockedUntil,
      };

      setLoginAttempts(newAttempts);
      localStorage.setItem('loginAttempts', JSON.stringify(newAttempts));
      setError(err.message || 'Failed to log in');
    }
  };

  const isLocked = Boolean(loginAttempts.lockedUntil && Date.now() < loginAttempts.lockedUntil);

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      {/* Static Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.7)',
        }}
      />

      {/* Login Card */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  borderRadius: '16px',
                  padding: '14px 16px',
                  border: '2px solid #ccc',
                  fontSize: '16px',
                }}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <div style={{ position: 'relative' }}>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              <div className="text-end mt-2">
                <Link to="/forgot-password" style={{ color: '#333', fontSize: '14px', textDecoration: 'none', fontWeight: '600' }}>
                  Forgot password?
                </Link>
              </div>
            </Form.Group>

            <Button
              type="submit"
              className="w-100 mb-3"
              disabled={isLoading || isLocked}
              style={{
                backgroundColor: '#e60023',
                borderColor: '#e60023',
                borderRadius: '24px',
                padding: '14px',
                fontSize: '16px',
                fontWeight: '600',
              }}
            >
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Logging in...
                </>
              ) : isLocked ? (
                `Try again in ${remainingTime}s`
              ) : (
                'Log in'
              )}
            </Button>
          </Form>

          <div className="text-center">
            <small className="text-muted">OR</small>
          </div>

          <div className="text-center mt-3">
            <p className="text-muted">
              Not on Pinterest yet?{' '}
              <Link to="/register" style={{ color: '#e60023', fontWeight: '600', textDecoration: 'none' }}>
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;