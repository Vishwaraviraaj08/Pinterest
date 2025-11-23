import React, { useState } from 'react';
import { Container, Row, Col, Button, Nav, Image, Modal, Form, Badge } from 'react-bootstrap';
import { Settings, Share2, ExternalLink } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useParams } from 'react-router-dom';
import { mockBoards, mockPins } from '../utils/mockData';
import BoardCard from '../components/BoardCard';
import PinCard from '../components/PinCard';

const ProfilePage: React.FC = () => {
  const { userId } = useParams();
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('created');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.bio || '',
  });

  const isOwnProfile = userId === user?.id;
  const userPins = mockPins.filter(pin => pin.userId === userId);

  const handleSaveProfile = () => {
    updateProfile(editForm);
    setShowEditModal(false);
  };

  return (
    <>
      <Container style={{ maxWidth: '992px', marginTop: '112px' }}>
        {/* Profile Header */}
        <div className="text-center mb-4">
          <Image
            src={user?.avatar}
            roundedCircle
            width={128}
            height={128}
            style={{ objectFit: 'cover', marginBottom: '16px', display: 'block', margin: '0 auto 16px auto' }}
          />
          <h4 className="mb-1">{user?.firstName} {user?.lastName}</h4>
          <p className="text-muted mb-2">@{user?.username}</p>
          {user?.bio && <p className="mb-3">{user.bio}</p>}
          
          {/* Website Link */}
          <a
            href="https://www.sarahdesigns.com"
            target="_blank"
            rel="noopener noreferrer"
            className="d-inline-flex align-items-center gap-2 text-decoration-none mb-3"
            style={{ color: '#364153' }}
          >
            <ExternalLink size={16} />
            www.sarahdesigns.com
          </a>

          {/* Stats */}
          <div className="d-flex justify-content-center gap-4 mb-4">
            <div>
              <strong style={{ fontSize: '16px' }}>{user?.followers.toLocaleString()}</strong>
              <span className="text-muted ms-1" style={{ fontSize: '16px' }}>followers</span>
            </div>
            <div>
              <strong style={{ fontSize: '16px' }}>{user?.following}</strong>
              <span className="text-muted ms-1" style={{ fontSize: '16px' }}>following</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex justify-content-center gap-2">
            {isOwnProfile ? (
              <>
                <Button
                  variant="light"
                  className="rounded-pill"
                  style={{
                    backgroundColor: '#efefef',
                    border: 'none',
                    padding: '8px 24px',
                  }}
                  onClick={() => setShowEditModal(true)}
                >
                  Follow
                </Button>
                <Button
                  variant="light"
                  className="rounded-circle"
                  style={{
                    width: '36px',
                    height: '36px',
                    padding: '0',
                    border: 'none',
                  }}
                >
                  <Share2 size={16} />
                </Button>
                <Button
                  variant="light"
                  className="rounded-circle"
                  style={{
                    width: '36px',
                    height: '36px',
                    padding: '0',
                    border: 'none',
                  }}
                >
                  <Settings size={16} />
                </Button>
              </>
            ) : (
              <>
                <Button variant="danger" className="rounded-pill me-2">
                  Follow
                </Button>
                <Button variant="light" className="rounded-pill">
                  <Share2 size={16} />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-bottom mb-4">
          <Nav className="justify-content-center">
            <Nav.Item>
              <Nav.Link
                onClick={() => setActiveTab('created')}
                className="cursor-pointer"
                style={{
                  borderBottom: activeTab === 'created' ? '4px solid #000' : '4px solid transparent',
                  color: activeTab === 'created' ? '#000' : '#4a5565',
                  fontWeight: 'normal',
                  padding: '12px 16px',
                }}
              >
                Created
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                onClick={() => setActiveTab('saved')}
                className="cursor-pointer"
                style={{
                  borderBottom: activeTab === 'saved' ? '4px solid #000' : '4px solid transparent',
                  color: activeTab === 'saved' ? '#000' : '#4a5565',
                  fontWeight: 'normal',
                  padding: '12px 16px',
                }}
              >
                Saved
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>

        {/* Boards Section */}
        {activeTab === 'created' && (
          <>
            <div className="mb-4">
              <h5 className="mb-3">Boards</h5>
              <Row>
                {mockBoards.map((board) => (
                  <Col key={board.id} xs={12} sm={6} md={3} className="mb-4">
                    <BoardCard board={board} />
                  </Col>
                ))}
              </Row>
            </div>

            {/* Created Pins Section */}
            <div className="mb-4">
              <h5 className="mb-3">Created Pins</h5>
              <div className="masonry-grid">
                {userPins.slice(0, 4).map((pin) => (
                  <PinCard key={pin.id} pin={pin} />
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'saved' && (
          <div className="masonry-grid">
            {mockPins.map((pin) => (
              <PinCard key={pin.id} pin={pin} />
            ))}
          </div>
        )}
      </Container>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={editForm.firstName}
                onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={editForm.lastName}
                onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                placeholder="Tell your story"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleSaveProfile}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProfilePage;