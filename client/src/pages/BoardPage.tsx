import React, { useState } from 'react';
import { Container, Button, Dropdown, Modal, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { MoreHorizontal, Lock, Users, Plus } from 'lucide-react';
import { mockBoards, mockPins } from '../utils/mockData';
import PinCard from '../components/PinCard';

const BoardPage: React.FC = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [boardName, setBoardName] = useState('');
  const [boardDescription, setBoardDescription] = useState('');

  const board = mockBoards.find(b => b.id === boardId);
  const boardPins = mockPins.filter(pin => pin.boardId === boardId || pin.boardName === board?.name);

  if (!board) {
    return (
      <Container className="py-5 text-center">
        <h3>Board not found</h3>
        <Button variant="danger" onClick={() => navigate('/')}>
          Go to Home
        </Button>
      </Container>
    );
  }

  const handleEditBoard = () => {
    setBoardName(board.name);
    setBoardDescription(board.description);
    setShowEditModal(true);
  };

  const handleSaveBoard = () => {
    // Mock update - In production, this would call the Content Microservice
    console.log('Updating board:', { boardName, boardDescription });
    setShowEditModal(false);
  };

  return (
    <>
      <Container>
        <div className="text-center py-5">
          <h1 className="mb-2">{board.name}</h1>
          <p className="text-muted mb-3">{board.description}</p>
          <div className="d-flex justify-content-center align-items-center gap-3 mb-4">
            <div className="d-flex align-items-center">
              {board.isPrivate ? (
                <>
                  <Lock size={16} className="me-1" />
                  <small>Private</small>
                </>
              ) : (
                <>
                  <Users size={16} className="me-1" />
                  <small>Public</small>
                </>
              )}
            </div>
            <small className="text-muted">{board.pinCount} pins</small>
          </div>
          <div className="d-flex justify-content-center gap-2">
            <Button variant="light" className="rounded-pill" onClick={() => navigate('/create-pin')}>
              <Plus size={16} className="me-2" />
              Add Pin
            </Button>
            <Dropdown>
              <Dropdown.Toggle variant="light" className="rounded-pill">
                <MoreHorizontal size={16} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={handleEditBoard}>Edit board</Dropdown.Item>
                <Dropdown.Item>Share board</Dropdown.Item>
                <Dropdown.Item>Collaborate</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="text-danger">Delete board</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        {boardPins.length > 0 ? (
          <div className="masonry-grid">
            {boardPins.map((pin) => (
              <PinCard key={pin.id} pin={pin} />
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <p className="text-muted mb-3">No pins in this board yet</p>
            <Button variant="danger" onClick={() => navigate('/create-pin')}>
              Create your first pin
            </Button>
          </div>
        )}
      </Container>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit board</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                placeholder="Board name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={boardDescription}
                onChange={(e) => setBoardDescription(e.target.value)}
                placeholder="What's your board about?"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleSaveBoard}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BoardPage;
