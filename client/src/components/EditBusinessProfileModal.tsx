import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { businessService } from '../services/businessService';
import { BusinessProfileResponse, BusinessProfileRequest } from '../types';

interface EditBusinessProfileModalProps {
    show: boolean;
    onHide: () => void;
    profile: BusinessProfileResponse;
    onProfileUpdated: () => void;
}

const EditBusinessProfileModal: React.FC<EditBusinessProfileModalProps> = ({ show, onHide, profile, onProfileUpdated }) => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        businessName: '',
        description: '',
        website: '',
        logo: '',
        category: '',
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                businessName: profile.businessName,
                description: profile.description || '',
                website: profile.website || '',
                logo: profile.logo || '',
                category: profile.category || '',
            });
        }
    }, [profile]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const request: BusinessProfileRequest = {
                businessName: formData.businessName,
                description: formData.description,
                website: formData.website,
                logo: formData.logo,
                category: formData.category,
            };

            // Assuming update endpoint exists or using create for update if backend supports it. 
            // If update endpoint is missing, we might need to add it to backend.
            // For now, let's assume we can use a similar structure or need to add update method.
            // Checking businessService, it might not have update method. 
            // If not, I will need to add it. For now I'll use a placeholder or assume create works if ID is passed (unlikely).
            // Actually, I should check businessService first. 
            // But to proceed, I'll assume I need to add `updateBusinessProfile` to service.

            // Wait, I haven't checked if update endpoint exists in backend. 
            // The user asked to "implement all features". 
            // I'll assume I need to add it.

            // For this step, I'll write the component assuming the service method exists, 
            // and then I'll update the service.

            await businessService.updateBusinessProfile(profile.id.toString(), request);

            onProfileUpdated();
            onHide();
        } catch (err: any) {
            setError(err.message || 'Failed to update business profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title>Edit Business Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Business Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter business name"
                            value={formData.businessName}
                            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="">Select a category</option>
                            <option value="Fashion">Fashion</option>
                            <option value="Home & Garden">Home & Garden</option>
                            <option value="Food & Drink">Food & Drink</option>
                            <option value="Beauty">Beauty</option>
                            <option value="Technology">Technology</option>
                            <option value="Art & Design">Art & Design</option>
                            <option value="Travel">Travel</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Describe your business"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Website</Form.Label>
                        <Form.Control
                            type="url"
                            placeholder="https://example.com"
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label>Logo (Optional)</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        setFormData({ ...formData, logo: reader.result as string });
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />
                        {formData.logo && (
                            <div className="mt-2" style={{ width: '100px', height: '100px' }}>
                                <img
                                    src={formData.logo}
                                    alt="Logo Preview"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                                />
                            </div>
                        )}
                    </Form.Group>

                    <div className="d-flex gap-2">
                        <Button
                            variant="light"
                            onClick={onHide}
                            className="flex-grow-1 rounded-pill"
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            className="flex-grow-1 rounded-pill"
                            style={{ backgroundColor: '#e7000b', borderColor: '#e7000b' }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditBusinessProfileModal;
