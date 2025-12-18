import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await authService.generateOtp({ email });
            
            window.open(`/otp-display?otp=${response.otp}`, '_blank', 'width=400,height=400');
            setStep(2);
            setSuccessMessage('OTP sent! Check the popup window.');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send OTP. Please check your details.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await authService.verifyOtp({ email, otp });
            setStep(3);
            setSuccessMessage('OTP verified! Please set your new password.');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await authService.resetPassword({
                email,
                newPassword
            });
            setSuccessMessage('Password reset successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
            { }
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
                    <div className="mb-4">
                        <Button
                            variant="link"
                            className="p-0 text-dark text-decoration-none mb-3"
                            onClick={() => navigate('/login')}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}
                        >
                            <ArrowLeft size={20} /> Back to Login
                        </Button>
                        <h2 className="fw-bold mb-2">Reset Password</h2>
                        <p className="text-muted">
                            {step === 1 && "Enter your email to receive an OTP."}
                            {step === 2 && "Enter the OTP sent to your email."}
                            {step === 3 && "Create a new password for your account."}
                        </p>
                    </div>

                    {error && <Alert variant="danger">{error}</Alert>}
                    {successMessage && <Alert variant="success">{successMessage}</Alert>}

                    {step === 1 && (
                        <Form onSubmit={handleSendOtp}>
                            <Form.Group className="mb-4">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{ borderRadius: '16px', padding: '12px' }}
                                />
                            </Form.Group>
                            <Button
                                type="submit"
                                className="w-100"
                                disabled={loading}
                                style={{
                                    backgroundColor: '#e60023',
                                    borderColor: '#e60023',
                                    borderRadius: '24px',
                                    padding: '12px',
                                    fontWeight: '600'
                                }}
                            >
                                {loading ? <Spinner animation="border" size="sm" /> : 'Send OTP'}
                            </Button>
                        </Form>
                    )}

                    {step === 2 && (
                        <Form onSubmit={handleVerifyOtp}>
                            <Form.Group className="mb-4">
                                <Form.Label>OTP Code</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter 6-digit OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    maxLength={6}
                                    style={{ borderRadius: '16px', padding: '12px', letterSpacing: '4px', textAlign: 'center', fontSize: '20px' }}
                                />
                            </Form.Group>
                            <Button
                                type="submit"
                                className="w-100"
                                disabled={loading}
                                style={{
                                    backgroundColor: '#e60023',
                                    borderColor: '#e60023',
                                    borderRadius: '24px',
                                    padding: '12px',
                                    fontWeight: '600'
                                }}
                            >
                                {loading ? <Spinner animation="border" size="sm" /> : 'Verify OTP'}
                            </Button>
                            <div className="text-center mt-3">
                                <Button variant="link" className="text-muted" onClick={() => setStep(1)}>
                                    Change Details
                                </Button>
                            </div>
                        </Form>
                    )}

                    {step === 3 && (
                        <Form onSubmit={handleResetPassword}>
                            <Form.Group className="mb-3">
                                <Form.Label>New Password</Form.Label>
                                <div style={{ position: 'relative' }}>
                                    <Form.Control
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        style={{ borderRadius: '16px', padding: '12px', paddingRight: '45px' }}
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
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {showPassword ? <EyeOff size={20} color="#767676" /> : <Eye size={20} color="#767676" />}
                                    </button>
                                </div>
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label>Confirm New Password</Form.Label>
                                <Form.Control
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    style={{ borderRadius: '16px', padding: '12px' }}
                                />
                            </Form.Group>
                            <Button
                                type="submit"
                                className="w-100"
                                disabled={loading}
                                style={{
                                    backgroundColor: '#e60023',
                                    borderColor: '#e60023',
                                    borderRadius: '24px',
                                    padding: '12px',
                                    fontWeight: '600'
                                }}
                            >
                                {loading ? <Spinner animation="border" size="sm" /> : 'Reset Password'}
                            </Button>
                        </Form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
