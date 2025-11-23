import React, { useState } from 'react';
import { Modal, Button, Image, Form, Dropdown } from 'react-bootstrap';
import { X, Bookmark, MoreHorizontal, ChevronDown, ExternalLink } from 'lucide-react';
import { Pin } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface PinDetailModalProps {
  show: boolean;
  onHide: () => void;
  pin: Pin;
}

const PinDetailModal: React.FC<PinDetailModalProps> = ({ show, onHide, pin }) => {
  const { user } = useAuth();
  const [comment, setComment] = useState('');
  const [showBoardDropdown, setShowBoardDropdown] = useState(false);
  const [comments, setComments] = useState([
    {
      id: '1',
      username: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100',
      text: 'This is absolutely stunning! Love the composition 😍',
      timestamp: '2d ago',
    },
    {
      id: '2',
      username: 'James Park',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
      text: 'Saved to my inspiration board! Thanks for sharing.',
      timestamp: '5d ago',
    },
  ]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      setComments([
        ...comments,
        {
          id: Date.now().toString(),
          username: user?.username || 'You',
          avatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
          text: comment,
          timestamp: 'Just now',
        },
      ]);
      setComment('');
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      contentClassName="border-0"
      dialogClassName="modal-pin-detail"
      backdropClassName="modal-backdrop-blur"
    >
      <Modal.Body className="p-0" style={{ borderRadius: '16px', overflow: 'hidden', height: '90vh', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)' }}>
        <div className="row g-0 h-100">
          {/* Left Side - Image */}
          <div className="col-md-7 bg-white d-flex align-items-center justify-content-center p-4" style={{ height: '90vh' }}>
            <img
              src={pin.imageUrl}
              alt={pin.title}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                borderRadius: '8px',
              }}
            />
          </div>

          {/* Right Side - Content */}
          <div className="col-md-5 d-flex flex-column bg-white" style={{ height: '90vh', borderLeft: '1px solid #e1e1e1' }}>
            {/* Top Bar - Fixed */}
            <div className="d-flex align-items-center justify-content-between p-3 border-bottom" style={{ minHeight: '60px' }}>
              <div className="d-flex gap-2">
                <Button variant="light" size="sm" className="rounded-circle p-2">
                  <MoreHorizontal size={20} />
                </Button>
              </div>

              <div className="d-flex gap-2">
                <Dropdown show={showBoardDropdown} onToggle={setShowBoardDropdown}>
                  <Dropdown.Toggle
                    variant="danger"
                    className="rounded-pill d-flex align-items-center gap-2"
                    style={{ backgroundColor: '#e60023', borderColor: '#e60023', padding: '8px 16px' }}
                  >
                    <Bookmark size={16} />
                    Save
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item>Home Inspiration</Dropdown.Item>
                    <Dropdown.Item>Travel Destinations</Dropdown.Item>
                    <Dropdown.Item>Recipe Ideas</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item>Create new board</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                <Button
                  variant="light"
                  size="sm"
                  className="rounded-circle p-2"
                  onClick={onHide}
                >
                  <X size={20} />
                </Button>
              </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-grow-1 overflow-auto p-4" style={{ maxHeight: 'calc(90vh - 180px)' }}>
              {/* Link */}
              {pin.link && (
                <a
                  href={pin.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="d-flex align-items-center gap-2 text-decoration-none text-secondary mb-3"
                  style={{ fontSize: '14px' }}
                >
                  <ExternalLink size={16} />
                  {new URL(pin.link).hostname}
                </a>
              )}

              {/* Title */}
              <h4 className="mb-2">{pin.title}</h4>

              {/* Description */}
              <p className="text-secondary mb-3">{pin.description}</p>

              {/* Stats */}
              <div className="d-flex gap-4 mb-3" style={{ fontSize: '14px', color: '#4a5565' }}>
                <span>{pin.saves} saves</span>
                <span>{comments.length} comments</span>
              </div>

              {/* User Info */}
              <div className="d-flex align-items-center gap-3 py-3 border-top border-bottom mb-4">
                <Image
                  src={pin.userAvatar}
                  roundedCircle
                  width={48}
                  height={48}
                  style={{ objectFit: 'cover', minWidth: '48px', minHeight: '48px' }}
                />
                <div className="flex-grow-1">
                  <div className="fw-semibold">{pin.username}</div>
                  <small className="text-secondary">12.5k followers</small>
                </div>
                <Button variant="secondary" size="sm" className="rounded-pill px-3">
                  Follow
                </Button>
              </div>

              {/* Comments Section - Scrollable */}
              <div className="mb-4">
                <h5 className="mb-3">{comments.length} Comments</h5>

                <div className="mb-3">
                  {comments.map((c) => (
                    <div key={c.id} className="d-flex gap-3 mb-3">
                      <Image
                        src={c.avatar}
                        roundedCircle
                        width={32}
                        height={32}
                        style={{ objectFit: 'cover', minWidth: '32px', minHeight: '32px' }}
                      />
                      <div className="flex-grow-1">
                        <div className="mb-1">
                          <strong style={{ fontSize: '14px' }}>{c.username}</strong>
                          <span className="text-secondary ms-2" style={{ fontSize: '14px' }}>
                            · {c.timestamp}
                          </span>
                        </div>
                        <p className="mb-0" style={{ fontSize: '14px', color: '#364153' }}>
                          {c.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Add Comment - Fixed at Bottom */}
            <div className="p-3 border-top bg-white" style={{ minHeight: '80px' }}>
              <Form onSubmit={handleAddComment}>
                <div className="d-flex gap-2 align-items-center">
                  <Image
                    src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                    roundedCircle
                    width={32}
                    height={32}
                    style={{ objectFit: 'cover', minWidth: '32px', minHeight: '32px' }}
                  />
                  <Form.Control
                    type="text"
                    placeholder="Add a comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="rounded-pill"
                    style={{ border: '2px solid #e1e1e1', padding: '8px 16px' }}
                  />
                </div>
              </Form>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default PinDetailModal;