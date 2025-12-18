import { useState, useEffect } from 'react';
import { Container, Button, Dropdown, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { MoreHorizontal, Lock, Users, Plus } from 'lucide-react';
import PinCard from '../components/PinCard';
import { useBoards } from '../contexts/BoardContext';
import { usePins } from '../contexts/PinContext';
import { BoardRequest, BoardResponse } from '../types';
import InviteCollaboratorModal from '../components/InviteCollaboratorModal';

const BoardPage: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const { boards, fetchBoardById, selectedBoard, updateBoard, deleteBoard, isLoading: isBoardLoading, error: boardError } = useBoards();
  const [board, setBoard] = useState<BoardResponse | undefined>(undefined);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [boardName, setBoardName] = useState('');
  const [boardDescription, setBoardDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (boardId) {
      const foundBoard = boards.find(b => b.id.toString() === boardId);
      if (foundBoard) {
        setBoard(foundBoard);
        setBoardName(foundBoard.name);
        setBoardDescription(foundBoard.description || '');
        setIsPrivate(foundBoard.isPrivate);
      } else {
        
        fetchBoardById(parseInt(boardId));
      }
    }
  }, [boardId, boards, fetchBoardById]);

  
  useEffect(() => {
    if (selectedBoard && selectedBoard.id.toString() === boardId) {
      setBoard(selectedBoard);
      setBoardName(selectedBoard.name);
      setBoardDescription(selectedBoard.description || '');
      setIsPrivate(selectedBoard.isPrivate);
    }
  }, [selectedBoard, boardId]);

  const handleEditBoard = () => {
    if (board) {
      setBoardName(board.name);
      setBoardDescription(board.description || '');
      setIsPrivate(board.isPrivate);
      setShowEditModal(true);
    }
  };

  const handleSaveBoard = async () => {
    if (!board || !boardId) return;
    try {
      const updateData: BoardRequest = {
        name: boardName,
        description: boardDescription,
        isPrivate: isPrivate
      };
      await updateBoard(parseInt(boardId), updateData);
      setShowEditModal(false);
      alert('Board updated successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to update board');
    }
  };

  const handleDeleteBoard = async () => {
    if (!boardId) return;
    if (window.confirm('Are you sure you want to delete this board? This action cannot be undone.')) {
      try {
        await deleteBoard(parseInt(boardId));
        navigate('/boards');
      } catch (err: any) {
        setError(err.message || 'Failed to delete board');
      }
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  if (isBoardLoading && !board) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="danger" />
      </div>
    );
  }

  if (!board && !isBoardLoading) {
    return (
      <Container className="py-5 text-center">
        <h3>Board not found</h3>
        <Button variant="danger" onClick={() => navigate('/')}>
          Go to Home
        </Button>
      </Container>
    );
  }

  const boardPins = board?.pins || [];

  return (
    <>
      <Container>
        <div className="text-center py-5">
          {board?.coverImage && (
            <div
              className="mb-4 mx-auto"
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <img
                src={board.coverImage}
                alt={board.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          )}
          <h1 className="mb-2">{board?.name}</h1>
          <p className="text-muted mb-3">{board?.description}</p>

          {error && <Alert variant="danger">{error}</Alert>}
          {boardError && <Alert variant="danger">{boardError}</Alert>}

          <div className="d-flex justify-content-center align-items-center gap-3 mb-4">
            <div className="d-flex align-items-center">
              {board?.isPrivate ? (
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
            <small className="text-muted">{board?.pinCount || boardPins.length} pins</small>
          </div>
          <div className="d-flex justify-content-center gap-2">
            <Button
              variant="light"
              className="rounded-pill d-flex align-items-center"
              onClick={() => navigate('/create-pin')}
              style={{ height: '48px', padding: '0 24px' }}
            >
              <Plus size={20} className="me-2" />
              <span style={{ fontWeight: 600 }}>Add Pin</span>
            </Button>
            <Dropdown>
              <Dropdown.Toggle
                variant="light"
                className="rounded-pill d-flex align-items-center justify-content-center"
                style={{ width: '48px', height: '48px', padding: 0 }}
              >
                <MoreHorizontal size={20} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={handleEditBoard}>Edit board</Dropdown.Item>
                <Dropdown.Item onClick={handleShare}>Share board</Dropdown.Item>
                <Dropdown.Item onClick={() => setShowInviteModal(true)}>Collaborate</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="text-danger" onClick={handleDeleteBoard}>Delete board</Dropdown.Item>
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
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Keep this board secret"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
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

      {board && (
        <InviteCollaboratorModal
          show={showInviteModal}
          onHide={() => setShowInviteModal(false)}
          boardId={board.id}
          boardName={board.name}
        />
      )}
    </>
  );
};

export default BoardPage;
