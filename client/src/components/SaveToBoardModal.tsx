import React, { useState } from 'react';
import { Modal, Button, Form, ListGroup } from 'react-bootstrap';
import { Plus, Check } from 'lucide-react';
import { Pin } from '../types';
import { mockBoards } from '../utils/mockData';

interface SaveToBoardModalProps {
  show: boolean;
  onHide: () => void;
  pin: Pin;
}

const SaveToBoardModal: React.FC<SaveToBoardModalProps> = ({ show, onHide, pin }) => {
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');

  const handleSave = () => {
    // Mock save functionality - In production, this would call the Content Microservice
    console.log(`Saving pin ${pin.id} to board ${selectedBoard}`);
    onHide();
  };

  const handleCreateBoard = () => {
    if (newBoardName.trim()) {
      console.log(`Creating new board: ${newBoardName}`);
      setShowCreateBoard(false);
      setNewBoardName('');
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Save to board</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!showCreateBoard ? (
          <>
            <Button
              variant="light"
              className="w-100 mb-3 d-flex align-items-center justify-content-center"
              onClick={() => setShowCreateBoard(true)}
            >
              <Plus size={20} className="me-2" />
              Create board
            </Button>

            <ListGroup>
              {mockBoards.map((board) => (
                <ListGroup.Item
                  key={board.id}
                  action
                  onClick={() => setSelectedBoard(board.id)}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div className="d-flex align-items-center">
                    <div
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        marginRight: '12px',
                      }}
                    >
                      <img
                        src={board.coverImages[0]}
                        alt={board.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div>
                      <div className="fw-semibold">{board.name}</div>
                      <small className="text-muted">{board.pinCount} pins</small>
                    </div>
                  </div>
                  {selectedBoard === board.id && <Check size={20} color="green" />}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </>
        ) : (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Board name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter board name"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                autoFocus
              />
            </Form.Group>
            <div className="d-flex gap-2">
              <Button
                variant="secondary"
                onClick={() => setShowCreateBoard(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleCreateBoard}
              >
                Create
              </Button>
            </div>
          </>
        )}
      </Modal.Body>
      {!showCreateBoard && (
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleSave}
            disabled={!selectedBoard}
          >
            Save
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default SaveToBoardModal;
