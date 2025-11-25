import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface CreateBoardModalProps {
  show: boolean;
  onHide: () => void;
  onCreateBoard: (boardData: {
    name: string;
    description: string;
    isPrivate: boolean;
    isCollaborative: boolean;
    coverImage?: string;
  }) => void;
}

const CreateBoardModal: React.FC<CreateBoardModalProps> = ({ show, onHide, onCreateBoard }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPrivate: false,
    isCollaborative: false,
    coverImage: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateBoard(formData);
    setFormData({
      name: '',
      description: '',
      isPrivate: false,
      isCollaborative: false,
      coverImage: '',
    });
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title>Create Board</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-grow-1 rounded-pill"
              style={{ backgroundColor: '#e7000b', borderColor: '#e7000b' }}
            >
              Create
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateBoardModal;
