import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { businessService } from '../services/businessService';
import { BusinessProfileRequest } from '../types';

interface CreateBusinessProfileModalProps {
    show: boolean;
    onHide: () => void;
    onProfileCreated: () => void;
}

const CreateBusinessProfileModal: React.FC<CreateBusinessProfileModalProps> = ({ show, onHide, onProfileCreated }) => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        businessName: '',
        description: '',
        website: '',
        logo: '',
        category: '',
    });

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

            await businessService.createBusinessProfile(request);
            onProfileCreated();
            onHide();
        } catch (err: any) {
            setError(err.message || 'Failed to create business profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title>Create Business Profile</Modal.Title>
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
                            {isLoading ? 'Create Profile' : 'Creating...'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default CreateBusinessProfileModal;
