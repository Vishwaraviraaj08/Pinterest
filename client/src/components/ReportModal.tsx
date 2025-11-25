import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { contentService } from '../services/contentService';

interface ReportModalProps {
    show: boolean;
    onHide: () => void;
    pinId: number;
}

const ReportModal: React.FC<ReportModalProps> = ({ show, onHide, pinId }) => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await contentService.createReport({ title, message, pinId });
            onHide();
            setTitle('');
            setMessage('');
            alert('Report submitted successfully');
        } catch (error) {
            console.error('Failed to submit report:', error);
            alert('Failed to submit report');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Report Pin</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Reason</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Why are you reporting this?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Details</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Provide more details..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="secondary" onClick={onHide}>
                            Cancel
                        </Button>
                        <Button variant="danger" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Report'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ReportModal;
