import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useBoards } from '../contexts/BoardContext';
import { useAuth } from '../contexts/AuthContext';
import { businessService } from '../services/businessService';
import { BoardRequest } from '../types';

interface CreateBoardModalProps {
  show: boolean;
  onHide: () => void;
  onBoardCreated?: () => void;
  initialBoardType?: 'DEFAULT' | 'SHOWCASE';
}

const CreateBoardModal: React.FC<CreateBoardModalProps> = ({ show, onHide, onBoardCreated, initialBoardType = 'DEFAULT' }) => {
  const { createBoard } = useBoards();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasBusinessProfile, setHasBusinessProfile] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPrivate: false,
    isCollaborative: false,
    coverImage: '',
    boardType: initialBoardType,
  });

  useEffect(() => {
    const checkBusinessProfile = async () => {
      if (user?.id) {
        const profile = await businessService.getProfileByUserId(user.id);
        setHasBusinessProfile(!!profile);
      }
    };
    if (show) {
      checkBusinessProfile();
      setFormData(prev => ({ ...prev, boardType: initialBoardType }));
    }
  }, [show, user?.id, initialBoardType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const request: BoardRequest = {
        name: formData.name,
        description: formData.description,
        isPrivate: formData.isPrivate,
        coverImage: formData.coverImage,
        boardType: formData.boardType,
      };

      await createBoard(request);

      setFormData({
        name: '',
        description: '',
        isPrivate: false,
        isCollaborative: false,
        coverImage: '',
        boardType: 'DEFAULT',
      });

      if (onBoardCreated) {
        onBoardCreated();
      }
      onHide();
    } catch (err: any) {
      setError(err.message || 'Failed to create board');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title>Create Board</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter board name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </Form.Group>

          {hasBusinessProfile && (
            <Form.Group className="mb-3">
              <Form.Label>Board Type</Form.Label>
              <div className="d-flex gap-3">
                <Form.Check
                  type="radio"
                  id="type-default"
                  label="Regular Board"
                  name="boardType"
                  checked={formData.boardType === 'DEFAULT'}
                  onChange={() => setFormData({ ...formData, boardType: 'DEFAULT' })}
                />
                <Form.Check
                  type="radio"
                  id="type-showcase"
                  label="Showcase"
                  name="boardType"
                  checked={formData.boardType === 'SHOWCASE'}
                  onChange={() => setFormData({ ...formData, boardType: 'SHOWCASE' })}
                />
              </div>
              <Form.Text className="text-muted">
                Showcases are curated collections featured on your business profile.
              </Form.Text>
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              id="keep-private"
              checked={formData.isPrivate}
              onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
              label={
                <div>
                  <div className="fw-semibold">Keep this board private</div>
                  <small className="text-muted">Only you can see this board</small>
                </div>
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              id="collaborative"
              checked={formData.isCollaborative}
              onChange={(e) => setFormData({ ...formData, isCollaborative: e.target.checked })}
              label={
                <div>
                  <div className="fw-semibold">Make this board collaborative</div>
                  <small className="text-muted">Allow others to add pins</small>
                </div>
              }
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter board description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Cover Image (Optional)</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setFormData({ ...formData, coverImage: reader.result as string });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            {formData.coverImage && (
              <div className="mt-2" style={{ width: '100px', height: '100px' }}>
                <img
                  src={formData.coverImage}
                  alt="Cover Preview"
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
              {isLoading ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateBoardModal;
