import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { useBoards } from '../contexts/BoardContext';
import { Board } from '../types';

interface EditBoardModalProps {
    show: boolean;
    onHide: () => void;
    board: Board;
}

const EditBoardModal: React.FC<EditBoardModalProps> = ({ show, onHide, board }) => {
    const { updateBoard } = useBoards();
    const [name, setName] = useState(board.name);
    const [description, setDescription] = useState(board.description || '');
    const [isPrivate, setIsPrivate] = useState(board.isPrivate);
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (show) {
            setName(board.name);
            setDescription(board.description || '');
            setIsPrivate(board.isPrivate);
            setCoverImageFile(null);
            setError(null);
        }
    }, [show, board]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCoverImageFile(e.target.files[0]);
        }
    };

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            let coverImageBase64 = board.coverImage;
            if (coverImageFile) {
                coverImageBase64 = await convertToBase64(coverImageFile);
            }

            await updateBoard(board.id, {
                name,
                description,
                isPrivate,
                coverImage: coverImageBase64,
            });
            onHide();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update board');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit Board</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Cover Image</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        {coverImageFile ? (
                            <div className="mt-2 text-muted small">Selected: {coverImageFile.name}</div>
                        ) : board.coverImage && (
                            <div className="mt-2">
                                <img src={board.coverImage} alt="Current Cover" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                                <span className="ms-2 text-muted small">Current Image</span>
                            </div>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label="Keep this board secret"
                            checked={isPrivate}
                            onChange={(e) => setIsPrivate(e.target.checked)}
                        />
                        <Form.Text className="text-muted">
                            So only you and collaborators can see it.
                        </Form.Text>
                    </Form.Group>

                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="secondary" onClick={onHide}>
                            Cancel
                        </Button>
                        <Button variant="danger" type="submit" disabled={isLoading}>
                            {isLoading ? <Spinner animation="border" size="sm" /> : 'Save'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditBoardModal;
