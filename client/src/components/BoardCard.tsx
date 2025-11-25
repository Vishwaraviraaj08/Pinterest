import React from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { Board } from '../types';

interface BoardCardProps {
  board: Board;
}

const BoardCard: React.FC<BoardCardProps> = ({ board }) => {
  const navigate = useNavigate();

  return (
    <Card
      className="border-0 cursor-pointer"
      onClick={() => navigate(`/board/${board.id}`)}
      style={{ transition: 'transform 0.2s' }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <div
        className="position-relative bg-light"
        style={{
          height: '178px',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        {board.coverImage ? (
          <img
            src={board.coverImage}
            alt={board.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-secondary text-white">
            <span style={{ fontSize: '2rem' }}>{board.name.charAt(0).toUpperCase()}</span>
          </div>
        )}
        {board.isPrivate && (
          <div
            className="position-absolute bg-white d-flex align-items-center justify-content-center"
            style={{
              top: '12px',
              right: '12px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              opacity: 0.9,
            }}
          >
            <Lock size={16} />
          </div>
        )}
      </div>
      <Card.Body className="px-0">
        <Card.Title className="mb-1" style={{ fontSize: '16px' }}>
          {board.name}
        </Card.Title>
        <Card.Text className="text-muted" style={{ fontSize: '14px' }}>
          {board.pinCount} pins
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default BoardCard;