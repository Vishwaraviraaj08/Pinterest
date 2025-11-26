import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Button, Nav, Image, Modal, Form, Spinner, InputGroup } from 'react-bootstrap';
import { Settings, Share2, ExternalLink, Edit2, Search, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePins } from '../contexts/PinContext';
import { useBoards } from '../contexts/BoardContext';
import { useConnections } from '../contexts/ConnectionContext';
import { useParams, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { collaborationService } from '../services/collaborationService';
import { UserResponse } from '../types';
import BoardCard from '../components/BoardCard';
import PinCard from '../components/PinCard';

const ProfilePage: React.FC = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, updateProfile } = useAuth();
  const { pins, drafts, fetchUserPins, fetchUserDrafts, isLoading: pinsLoading } = usePins();
  const { boards, fetchUserBoards, isLoading: boardsLoading } = useBoards();
  const { following, followUser, unfollowUser, fetchFollowing } = useConnections();

  const [profileUser, setProfileUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('created');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    bio: '',
  });
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  // Search and Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const parsedUserId = userId ? parseInt(userId) : currentUser?.id;
  const isOwnProfile = currentUser?.id === parsedUserId;
  const isFollowing = following.some(f => f.followingId === parsedUserId);

  // Filter and Sort Logic
  const filteredPins = useMemo(() => {
    let result = [...pins];
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(pin =>
        pin.title.toLowerCase().includes(lowerQuery) ||
        pin.description?.toLowerCase().includes(lowerQuery)
      );
    }
    return result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'alphabetical') return a.title.localeCompare(b.title);
      return 0;
    });
  }, [pins, searchQuery, sortBy]);

  const filteredBoards = useMemo(() => {
    let result = [...boards];
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(board =>
        board.name.toLowerCase().includes(lowerQuery)
      );
    }
    return result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      if (sortBy === 'oldest') return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      if (sortBy === 'alphabetical') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [boards, searchQuery, sortBy]);

  useEffect(() => {
    const loadProfileData = async () => {
      if (!parsedUserId) return;

      setLoading(true);
      try {
        // Fetch profile
        if (isOwnProfile && currentUser) {
          setProfileUser(currentUser);
          setEditForm({
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            bio: currentUser.bio || '',
          });
        } else {
          const data = await authService.getProfile(parsedUserId);
          setProfileUser(data);
        }

        // Fetch content
        await Promise.all([
          fetchUserPins(parsedUserId),
          fetchUserBoards(parsedUserId),
          currentUser && fetchFollowing(currentUser.id)
        ]);

        if (isOwnProfile) {
          fetchUserDrafts();
        }

        // Fetch counts separately to avoid context conflict
        try {
          const followersData = await collaborationService.getFollowers(parsedUserId);
          setFollowersCount(followersData.length);
          const followingData = await collaborationService.getFollowing(parsedUserId);
          setFollowingCount(followingData.length);
        } catch (e) {
          console.error("Failed to fetch connection counts", e);
        }

      } catch (error) {
        console.error('Failed to load profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [parsedUserId, isOwnProfile, currentUser, fetchUserPins, fetchUserBoards, fetchFollowing, fetchUserDrafts]);

  const handleSaveProfile = () => {
    updateProfile(editForm);
    setShowEditModal(false);
    // Optimistically update local state if it's own profile
    if (isOwnProfile && profileUser) {
      setProfileUser({ ...profileUser, ...editForm });
    }
  };

  const handleFollowToggle = async () => {
    if (!parsedUserId) return;
    try {
      if (isFollowing) {
        await unfollowUser(parsedUserId);
        setFollowersCount(prev => Math.max(0, prev - 1));
      } else {
        await followUser(parsedUserId);
        setFollowersCount(prev => prev + 1);
      }
      // Refresh following list
      if (currentUser) fetchFollowing(currentUser.id);
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="danger" />
      </div>
    );
  }

  return (
    <>
      <Container style={{ maxWidth: '992px', marginTop: '112px' }}>
        {/* Profile Header */}
        <div className="text-center mb-4">
          <Image
            src={profileUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileUser?.username}`}
            roundedCircle
            width={128}
            height={128}
            style={{ objectFit: 'cover', marginBottom: '16px', display: 'block', margin: '0 auto 16px auto' }}
          />
          <h4 className="mb-1">{profileUser?.firstName} {profileUser?.lastName}</h4>
          <p className="text-muted mb-2">@{profileUser?.username}</p>
          {profileUser?.bio && <p className="mb-3">{profileUser.bio}</p>}

          {/* Stats */}
          <div className="d-flex justify-content-center gap-4 mb-4">
            <div className="cursor-pointer" onClick={() => navigate(`/followers/${parsedUserId}`)}>
              <strong style={{ fontSize: '16px' }}>{followersCount}</strong>
              <span className="text-muted ms-1" style={{ fontSize: '16px' }}>followers</span>
            </div>
            <div className="cursor-pointer" onClick={() => navigate(`/followers/${parsedUserId}`)}>
              <strong style={{ fontSize: '16px' }}>{followingCount}</strong>
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
                  Edit Profile
                </Button>
                <Button
                  variant="light"
                  className="rounded-circle"
                  style={{ width: '36px', height: '36px', padding: '0', border: 'none' }}
                >
                  <Share2 size={16} />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant={isFollowing ? "secondary" : "danger"}
                  className="rounded-pill me-2"
                  onClick={handleFollowToggle}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
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
            {isOwnProfile && (
              <Nav.Item>
                <Nav.Link
                  onClick={() => setActiveTab('drafts')}
                  className="cursor-pointer"
                  style={{
                    borderBottom: activeTab === 'drafts' ? '4px solid #000' : '4px solid transparent',
                    color: activeTab === 'drafts' ? '#000' : '#4a5565',
                    fontWeight: 'normal',
                    padding: '12px 16px',
                  }}
                >
                  Drafts
                </Nav.Link>
              </Nav.Item>
            )}
          </Nav>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-4">
          <Row className="g-2 align-items-center">
            <Col>
              <InputGroup>
                <InputGroup.Text className="bg-light border-0 rounded-pill-start ps-3">
                  <Search size={18} className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search your pins and boards"
                  className="bg-light border-0 rounded-pill-end"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col xs="auto">
              <Form.Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border-0 bg-light rounded-pill"
                style={{ cursor: 'pointer' }}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="alphabetical">A-Z</option>
              </Form.Select>
            </Col>
            <Col xs="auto">
              <Button variant="light" className="rounded-circle p-2">
                <Plus size={24} onClick={() => navigate('/create-pin')} />
              </Button>
            </Col>
          </Row>
        </div>

        {/* Created Tab - Pins Only */}
        {activeTab === 'created' && (
          <div className="mb-4">
            {pinsLoading ? (
              <Spinner animation="border" size="sm" />
            ) : filteredPins.length > 0 ? (
              <div className="masonry-grid">
                {filteredPins.map((pin) => (
                  <PinCard key={pin.id} pin={pin} />
                ))}
              </div>
            ) : (
              <p className="text-muted text-center py-5">No pins found.</p>
            )}
          </div>
        )}

        {/* Saved Tab - Boards */}
        {activeTab === 'saved' && (
          <div className="mb-4">
            {boardsLoading ? (
              <Spinner animation="border" size="sm" />
            ) : filteredBoards.length > 0 ? (
              <Row>
                {filteredBoards.map((board) => (
                  <Col key={board.id} xs={12} sm={6} md={3} className="mb-4">
                    <BoardCard board={board} />
                  </Col>
                ))}
              </Row>
            ) : (
              <p className="text-muted text-center py-5">No boards found.</p>
            )}
          </div>
        )}

        {/* Drafts Tab */}
        {activeTab === 'drafts' && isOwnProfile && (
          <div className="mb-4">
            <h5 className="mb-3">Your Drafts</h5>
            {pinsLoading ? (
              <Spinner animation="border" size="sm" />
            ) : drafts.length > 0 ? (
              <Row>
                {drafts.map((draft) => (
                  <Col key={draft.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                    <div
                      className="position-relative"
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate('/create-pin', { state: { editPin: draft } })}
                    >
                      <Image
                        src={draft.imageUrl}
                        fluid
                        style={{ borderRadius: '16px', width: '100%', height: 'auto', objectFit: 'cover' }}
                      />
                      <div
                        className="position-absolute top-0 end-0 p-2"
                        style={{ background: 'rgba(0,0,0,0.5)', borderRadius: '0 16px 0 16px', color: 'white' }}
                      >
                        <Edit2 size={16} />
                      </div>
                      <h6 className="mt-2 mb-0 text-truncate">{draft.title || 'Untitled Draft'}</h6>
                      <small className="text-muted">Last edited: {new Date(draft.updatedAt).toLocaleDateString()}</small>
                    </div>
                  </Col>
                ))}
              </Row>
            ) : (
              <p className="text-muted">No drafts found.</p>
            )}
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