import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Plus } from 'lucide-react';
import BoardCard from '../components/BoardCard';
import CreateBoardModal from '../components/CreateBoardModal';
import { mockBoards } from '../utils/mockData';
import { Board } from '../types';

const BoardsPage: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [boards, setBoards] = useState(mockBoards);

  const handleCreateBoard = (boardData: {
    name: string;
    description: string;
    isPrivate: boolean;
    isCollaborative: boolean;
  }) => {
    const newBoard: Board = {
      id: Date.now().toString(),
      name: boardData.name,
      description: boardData.description,
      userId: '1',
      pins: [],
      pinCount: 0,
      isPrivate: boardData.isPrivate,
      collaborators: boardData.isCollaborative ? [] : undefined,
      coverImages: [],
      createdAt: new Date().toISOString(),
    };

    setBoards([...boards, newBoard]);
    console.log('Creating board:', boardData);
  };

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

        {/* Boards Grid */}
        <Row>
          {boards.map((board) => (
            <Col key={board.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <BoardCard board={board} />
            </Col>
          ))}
        </Row>

        {boards.length === 0 && (
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
        onCreateBoard={handleCreateBoard}
      />
    </>
  );
};

export default BoardsPage;
