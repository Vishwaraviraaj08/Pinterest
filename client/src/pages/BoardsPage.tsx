import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { Plus } from 'lucide-react';
import BoardCard from '../components/BoardCard';
import CreateBoardModal from '../components/CreateBoardModal';
import { useBoards } from '../contexts/BoardContext';
import { useAuth } from '../contexts/AuthContext';

const BoardsPage: React.FC = () => {
  const { boards, fetchUserBoards, isLoading, error } = useBoards();
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchUserBoards(user.id);
    }
  }, [user?.id, fetchUserBoards]);

  const handleBoardCreated = () => {
    if (user?.id) {
      fetchUserBoards(user.id);
    }
    setShowCreateModal(false);
  };

  if (isLoading && boards.length === 0) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="danger" />
      </div>
    );
  }

  return (
    <>
      <Container className="py-5" style={{ marginTop: '72px' }}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">Your Boards</h4>
          <Button
            variant="danger"
            className="rounded-pill d-flex align-items-center gap-2"
            onClick={() => setShowCreateModal(true)}
            style={{ backgroundColor: '#e7000b', borderColor: '#e7000b' }}
          >
            <Plus size={20} />
            Create Board
          </Button>
        </div>

        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        {/* Boards Grid */}
        <Row>
          {boards.map((board) => (
            <Col key={board.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <BoardCard board={board} />
            </Col>
          ))}
        </Row>

        {boards.length === 0 && !isLoading && (
          <div className="text-center py-5">
            <h5 className="mb-3">No boards yet</h5>
            <p className="text-muted mb-4">
              Create your first board to organize your pins
            </p>
            <Button
              variant="danger"
              className="rounded-pill"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={20} className="me-2" />
              Create Board
            </Button>
          </div>
        )}
      </Container>

      <CreateBoardModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        onBoardCreated={handleBoardCreated}
      />
    </>
  );
};

export default BoardsPage;
