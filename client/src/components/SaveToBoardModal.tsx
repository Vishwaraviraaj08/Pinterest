import React, { useState } from 'react';
import { Modal, Button, Form, ListGroup, Alert } from 'react-bootstrap';
import { Plus, Check } from 'lucide-react';
import { Pin, Board } from '../types';
import { contentService } from '../services/contentService';

interface SaveToBoardModalProps {
  show: boolean;
  onHide: () => void;
  pin: Pin;
  boards: Board[];
}

const SaveToBoardModal: React.FC<SaveToBoardModalProps> = ({ show, onHide, pin, boards }) => {
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSave = async () => {
    if (!selectedBoard) return;

    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    
    try {
      // Add existing pin to the selected board instead of creating a new pin
      await contentService.addPinToBoard(Number(selectedBoard), pin.id);
      setSuccessMessage('Pin saved successfully!');
      setTimeout(() => {
        onHide();
      }, 1500);
    } catch (error: any) {
      if (error?.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Failed to save pin. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateBoard = async () => {
    if (newBoardName.trim()) {
      setErrorMessage(null);
      setSuccessMessage(null);
      
      try {
        const newBoard = await contentService.createBoard({ name: newBoardName });
        // Add existing pin to the new board instead of creating a new pin
        await contentService.addPinToBoard(newBoard.id, pin.id);
        setSuccessMessage('Board created and pin saved successfully!');
        setTimeout(() => {
          setShowCreateBoard(false);
          setNewBoardName('');
          onHide();
        }, 1500);
      } catch (error: any) {
        if (error?.response?.data?.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage('Failed to create board or save pin. Please try again.');
        }
      }
    }
  };

  const isPinSavedToBoard = (board: Board) => {
    // Ensure pins array exists and check for pin ID match
    return board.pins?.some(p => Number(p.id) === Number(pin.id)) ?? false;
  };

  const handleClose = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setSelectedBoard(null);
    setShowCreateBoard(false);
    setNewBoardName('');
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Save to board</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorMessage && (
          <Alert variant="danger" className="mb-3">
            {errorMessage}
          </Alert>
        )}
        {successMessage && (
          <Alert variant="success" className="mb-3">
            {successMessage}
          </Alert>
        )}
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
              {(boards || []).map((board) => {
                const isSaved = isPinSavedToBoard(board);
                return (
                  <ListGroup.Item
                    key={board.id}
                    action={!isSaved}
                    onClick={() => !isSaved && setSelectedBoard(board.id.toString())}
                    className="d-flex justify-content-between align-items-center"
                    disabled={isSaved}
                    style={{ opacity: isSaved ? 0.7 : 1, cursor: isSaved ? 'default' : 'pointer' }}
                  >
                    <div className="d-flex align-items-center">
                      <div
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          marginRight: '12px',
                          backgroundColor: '#efefef'
                        }}
                      >
                        {board.coverImage ? (
                          <img
                            src={board.coverImage}
                            alt={board.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted">
                            No Img
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="fw-semibold">{board.name}</div>
                        <small className="text-muted">{board.pinCount} pins</small>
                      </div>
                    </div>
                    {isSaved ? (
                      <span className="badge bg-secondary">Saved</span>
                    ) : (
                      selectedBoard === board.id.toString() && <Check size={20} color="green" />
                    )}
                  </ListGroup.Item>
                );
              })}
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
                onClick={() => {
                  setShowCreateBoard(false);
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
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
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleSave}
            disabled={!selectedBoard || isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default SaveToBoardModal;
