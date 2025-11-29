import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { contentService } from '../services/contentService';
import { Pin, PinRequest } from '../types';

interface CreateSponsoredPinModalProps {
    show: boolean;
    onHide: () => void;
    onSuccess: () => void;
    editingPin?: Pin | null;
}

const CreateSponsoredPinModal: React.FC<CreateSponsoredPinModalProps> = ({ show, onHide, onSuccess, editingPin }) => {
    const [formData, setFormData] = useState<PinRequest>({
        title: '',
        description: '',
        imageUrl: '',
        promotionLink: '',
        sponsorName: '',
        campaignId: undefined,
        isSponsored: true,
        isPublic: true,
        isDraft: false
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editingPin) {
            setFormData({
                title: editingPin.title,
                description: editingPin.description,
                imageUrl: editingPin.imageUrl,
                promotionLink: editingPin.promotionLink || '',
                sponsorName: editingPin.sponsorName || '',
                campaignId: editingPin.campaignId,
                isSponsored: true,
                isPublic: true,
                isDraft: false
            });
        } else {
            setFormData({
                title: '',
                description: '',
                imageUrl: '',
                promotionLink: '',
                sponsorName: '',
                campaignId: undefined,
                isSponsored: true,
                isPublic: true,
                isDraft: false
            });
        }
        setError('');
    }, [editingPin, show]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (editingPin) {
                await contentService.updatePin(editingPin.id, formData);
            } else {
                await contentService.createPin(formData);
            }
            onSuccess();
            onHide();
        } catch (err: any) {
            console.error('Failed to save sponsored pin:', err);
            setError(err.response?.data?.message || 'Failed to save sponsored pin');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{editingPin ? 'Edit Sponsored Pin' : 'Create Sponsored Pin'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form.Group className="mb-3">
                        <Form.Label>Campaign Title</Form.Label>
                        <Form.Control
                            type="text"
                            required
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., Summer Sale 2024"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe the campaign..."
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Image URL</Form.Label>
                        <Form.Control
                            type="url"
                            required
                            value={formData.imageUrl}
                            onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                            placeholder="https://..."
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Promotion Link</Form.Label>
                        <Form.Control
                            type="url"
                            required
                            value={formData.promotionLink}
                            onChange={e => setFormData({ ...formData, promotionLink: e.target.value })}
                            placeholder="Where should users go when they click?"
                        />
                    </Form.Group>

                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Sponsor Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    required
                                    value={formData.sponsorName}
                                    onChange={e => setFormData({ ...formData, sponsorName: e.target.value })}
                                    placeholder="Brand Name"
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Campaign ID</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={formData.campaignId || ''}
                                    onChange={e => setFormData({ ...formData, campaignId: parseInt(e.target.value) || undefined })}
                                    placeholder="Optional"
                                />
                            </Form.Group>
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Cancel
                    </Button>
                    <Button variant="danger" type="submit" disabled={loading}>
                        {loading ? 'Saving...' : (editingPin ? 'Update Campaign' : 'Launch Campaign')}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default CreateSponsoredPinModal;
