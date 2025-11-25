import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Image, Dropdown, Badge, Spinner, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { Bookmark, ExternalLink, MoreHorizontal, Send, Edit, Trash } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePins } from '../contexts/PinContext';
import { authService } from '../services/authService';
import { UserResponse } from '../types';
import SaveToBoardModal from '../components/SaveToBoardModal';

const PinDetailPage: React.FC = () => {
  const { pinId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedPin: pin, fetchPinById, deletePin, isLoading, error } = usePins();

  const [creator, setCreator] = useState<UserResponse | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    {
      id: '1',
      username: 'user123',
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100',
      text: 'Love this! Where can I get one?',
      timestamp: '2h ago',
    },
    {
      id: '2',
      username: 'designer_pro',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
      text: 'Such great inspiration!',
      timestamp: '5h ago',
    },
  ]);

  useEffect(() => {
    if (pinId) {
      fetchPinById(parseInt(pinId));
    }
  }, [pinId, fetchPinById]);

  useEffect(() => {
    const loadCreator = async () => {
      if (pin?.userId) {
        try {
          const profile = await authService.getProfile(pin.userId);
          setCreator(profile);
        } catch (err) {
          console.error('Failed to load pin creator:', err);
        }
      }
    };
    loadCreator();
  }, [pin]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="danger" />
      </div>
    );
  }

  if (error || !pin) {
    return (
      <Container className="py-5 text-center">
        <h3>{error || 'Pin not found'}</h3>
        <Button variant="danger" onClick={() => navigate('/')}>
          Go to Home
        </Button>
      </Container>
    );
  }

  const isOwnPin = pin.userId === user?.id;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      setComments([
        {
          id: Date.now().toString(),
          username: user?.username || 'currentuser',
          avatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
          text: comment,
          timestamp: 'Just now',
        },
        ...comments,
      ]);
      setComment('');
    }
  };

  const handleEdit = () => {
    navigate(`/create-pin`, { state: { editPin: pin } });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this pin?')) {
      try {
        await deletePin(pin.id);
        navigate('/');
      } catch (err) {
        console.error('Failed to delete pin:', err);
        alert('Failed to delete pin');
      }
    }
  };

  return (
    <>
      <Container className="py-4">
        <Row>
          <Col lg={6} className="mb-4">
            <img
              src={pin.imageUrl}
              alt={pin.title}
              style={{
                width: '100%',
                borderRadius: '16px',
                maxHeight: '80vh',
                objectFit: 'contain',
              }}
            />
          </Col>
          <Col lg={6}>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className="d-flex gap-2">
                <Dropdown>
                  <Dropdown.Toggle variant="light" className="rounded-circle">
                    <MoreHorizontal size={20} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {isOwnPin && (
                      <>
                        <Dropdown.Item onClick={handleEdit}>
                          <Edit size={16} className="me-2" />
                          Edit Pin
                        </Dropdown.Item>
                        <Dropdown.Item onClick={handleDelete} className="text-danger">
                          <Trash size={16} className="me-2" />
                          Delete Pin
                        </Dropdown.Item>
                        <Dropdown.Divider />
                      </>
                    )}
                    <Dropdown.Item>Download image</Dropdown.Item>
                    <Dropdown.Item>Hide Pin</Dropdown.Item>
                    <Dropdown.Item>Report Pin</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                {pin.link && (
                  <Button
                    variant="light"
                    className="rounded-circle"
                    href={pin.link}
                    target="_blank"
                  >
                    <ExternalLink size={20} />
                  </Button>
                )}
              </div>
              <Button
                variant="danger"
                className="rounded-pill px-4"
                onClick={() => setShowSaveModal(true)}
              >
                <Bookmark size={16} className="me-2" />
                Save
              </Button>
            </div>

            {pin.isSponsored && (
              <Badge bg="dark" className="mb-3">
                Sponsored
              </Badge>
            )}

            {pin.link && (
              <div className="mb-3">
                <a
                  href={pin.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none"
                >
                  <small className="text-muted">{new URL(pin.link).hostname}</small>
                </a>
              </div>
            )}

            <h2 className="mb-3">{pin.title}</h2>
            <p className="text-muted mb-4">{pin.description}</p>

            <div className="d-flex align-items-center mb-4">
              <Image
                src={creator?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${creator?.username}`}
                roundedCircle
                width={48}
                height={48}
                className="me-3"
                style={{ objectFit: 'cover' }}
              />
              <div className="flex-grow-1">
                <div className="fw-semibold">{creator?.username || 'Unknown User'}</div>
                <small className="text-muted">{pin.savesCount || 0} saves</small>
              </div>
              {!isOwnPin && (
                <Button variant="light" className="rounded-pill">
                  Follow
                </Button>
              )}
            </div>

            <hr />

            <div className="mb-4">
              <h5 className="mb-3">{comments.length} Comments</h5>

              <Form onSubmit={handleAddComment} className="mb-4">
                <div className="d-flex gap-2">
                  <Form.Control
                    type="text"
                    placeholder="Add a comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="rounded-pill"
                  />
                  <Button
                    type="submit"
                    variant="light"
                    className="rounded-circle"
                    disabled={!comment.trim()}
                  >
                    <Send size={20} />
                  </Button>
                </div>
              </Form>

              {comments.map((c) => (
                <div key={c.id} className="d-flex mb-3">
                  <Image
                    src={c.avatar}
                    roundedCircle
                    width={32}
                    height={32}
                    className="me-2"
                    style={{ objectFit: 'cover' }}
                  />
                  <div>
                    <div>
                      <strong>{c.username}</strong>
                      <span className="text-muted ms-2">{c.timestamp}</span>
                    </div>
                    <p className="mb-0">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Container>

      {pin && (
        <SaveToBoardModal
          show={showSaveModal}
          onHide={() => setShowSaveModal(false)}
          pin={pin}
        />
      )}
    </>
  );
};

export default PinDetailPage;