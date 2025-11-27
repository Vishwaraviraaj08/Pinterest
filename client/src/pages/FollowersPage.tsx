
import React, { useState, useEffect, useMemo } from 'react';
import { Container, Nav, Row, Col, Card, Image, Button, Dropdown, Spinner, Alert, Form, InputGroup } from 'react-bootstrap';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { UserX, Flag, Search, MoreHorizontal } from 'lucide-react';
import { useConnections } from '../contexts/ConnectionContext';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { collaborationService } from '../services/collaborationService';
import { UserResponse } from '../types';

interface ConnectionUI extends UserResponse {
  connectionId: number;
  isFollowing: boolean;
}

const FollowersPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { followers, following, fetchFollowers, fetchFollowing, followUser, unfollowUser, isLoading: isConnLoading, error: connError } = useConnections();

  const initialTab = searchParams.get('tab') === 'following' ? 'following' : 'followers';
  const [activeTab, setActiveTab] = useState(initialTab);

  const [enrichedFollowers, setEnrichedFollowers] = useState<ConnectionUI[]>([]);
  const [enrichedFollowing, setEnrichedFollowing] = useState<ConnectionUI[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Store IDs of users the CURRENT user is following - using Record for reliable re-renders
  const [myFollowingIds, setMyFollowingIds] = useState<Record<number, boolean>>({});

  // Sync activeTab with URL
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && (tab === 'followers' || tab === 'following')) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  useEffect(() => {
    if (userId) {
      const id = parseInt(userId);
      fetchFollowers(id);
      fetchFollowing(id);
    }
  }, [userId, fetchFollowers, fetchFollowing]);

  // Fetch my own following list to know who I am following
  useEffect(() => {
    const fetchMyFollowing = async () => {
      if (currentUser?.id) {
        try {
          const myConnections = await collaborationService.getFollowing(currentUser.id);
          const ids: Record<number, boolean> = {};
          myConnections.forEach(c => {
            ids[c.followingId] = true;
          });
          setMyFollowingIds(ids);
        } catch (e) {
          console.error("Failed to fetch my following list", e);
        }
      }
    };
    fetchMyFollowing();
  }, [currentUser?.id]);

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoadingDetails(true);
      try {
        // Enrich Followers
        if (followers.length > 0) {
          const enrichedFollowersData = await Promise.all(
            followers.map(async (conn) => {
              try {
                const profile = await authService.getProfile(conn.followerId);
                return {
                  ...profile,
                  connectionId: conn.id,
                  isFollowing: myFollowingIds[conn.followerId] || false
                };
              } catch (e) {
                return null;
              }
            })
          );
          setEnrichedFollowers(enrichedFollowersData.filter((u): u is ConnectionUI => u !== null));
        } else {
          setEnrichedFollowers([]);
        }

        // Enrich Following
        if (following.length > 0) {
          const enrichedFollowingData = await Promise.all(
            following.map(async (conn) => {
              try {
                const profile = await authService.getProfile(conn.followingId);
                return {
                  ...profile,
                  connectionId: conn.id,
                  isFollowing: myFollowingIds[conn.followingId] || false
                };
              } catch (e) {
                return null;
              }
            })
          );
          setEnrichedFollowing(enrichedFollowingData.filter((u): u is ConnectionUI => u !== null));
        } else {
          setEnrichedFollowing([]);
        }

      } catch (error) {
        console.error('Error fetching connection details:', error);
      } finally {
        setIsLoadingDetails(false);
      }
    };

    if (!isConnLoading) {
      fetchDetails();
    }
  }, [followers, following, isConnLoading]);

  const handleFollowToggle = async (targetUserId: number, currentStatus: boolean) => {
    try {
      if (currentStatus) {
        await unfollowUser(targetUserId);
        setMyFollowingIds(prev => {
          const next = { ...prev };
          delete next[targetUserId];
          return next;
        });
      } else {
        await followUser(targetUserId);
        setMyFollowingIds(prev => ({
          ...prev,
          [targetUserId]: true
        }));
      }

      // If we are viewing our own profile, refresh the lists to reflect changes
      if (currentUser?.id === parseInt(userId || '0')) {
        fetchFollowing(parseInt(userId!));
      }
    } catch (error: any) {
      // Handle "Already following" error by syncing local state
      if (error.response?.status === 400) {
        setMyFollowingIds(prev => ({
          ...prev,
          [targetUserId]: true
        }));
        // Also refresh list if it's our profile, as we are apparently following them
        if (currentUser?.id === parseInt(userId || '0')) {
          fetchFollowing(parseInt(userId!));
        }
      } else {
        console.error('Failed to update connection:', error);
      }
    }
  };

  const handleBlock = (userId: number) => {
    if (window.confirm('Are you sure you want to block this user?')) {
      alert(`User ${userId} has been blocked. (Mock Action)`);
    }
  };

  const handleReport = (userId: number) => {
    if (window.confirm('Report this user for inappropriate behavior?')) {
      alert(`User ${userId} has been reported. (Mock Action)`);
    }
  };

  const filteredList = useMemo(() => {
    const list = activeTab === 'followers' ? enrichedFollowers : enrichedFollowing;
    if (!searchQuery) return list;
    const lowerQuery = searchQuery.toLowerCase();
    return list.filter(user =>
      user.username.toLowerCase().includes(lowerQuery) ||
      user.firstName.toLowerCase().includes(lowerQuery) ||
      user.lastName.toLowerCase().includes(lowerQuery)
    );
  }, [activeTab, enrichedFollowers, enrichedFollowing, searchQuery]);

  const isLoading = isConnLoading || isLoadingDetails;

  return (
    <Container className="py-4" style={{ maxWidth: '800px' }}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h4 className="mb-0 fw-bold">Connections</h4>
      </div>

      {connError && <Alert variant="danger">{connError}</Alert>}

      <div className="mb-4">
        <InputGroup>
          <InputGroup.Text className="bg-light border-0 rounded-pill-start ps-3">
            <Search size={18} className="text-muted" />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search by name or username"
            className="bg-light border-0 rounded-pill-end"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
      </div>

      <Nav variant="tabs" className="mb-4 border-bottom-0">
        <Nav.Item>
          <Nav.Link
            active={activeTab === 'followers'}
            onClick={() => handleTabChange('followers')}
            className="cursor-pointer px-4 rounded-pill me-2"
            style={{
              backgroundColor: activeTab === 'followers' ? '#111' : 'transparent',
              color: activeTab === 'followers' ? '#fff' : '#5f5f5f',
              fontWeight: '600'
            }}
          >
            Followers ({enrichedFollowers.length})
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            active={activeTab === 'following'}
            onClick={() => handleTabChange('following')}
            className="cursor-pointer px-4 rounded-pill"
            style={{
              backgroundColor: activeTab === 'following' ? '#111' : 'transparent',
              color: activeTab === 'following' ? '#fff' : '#5f5f5f',
              fontWeight: '600'
            }}
          >
            Following ({enrichedFollowing.length})
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {isLoading && filteredList.length === 0 ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="danger" />
        </div>
      ) : (
        <Row>
          <Col>
            {filteredList.length > 0 ? (
              filteredList.map((user) => (
                <Card key={user.id} className="mb-3 border-0 shadow-sm">
                  <Card.Body>
                    <div className="d-flex align-items-center">
                      <Image
                        src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                        roundedCircle
                        width={60}
                        height={60}
                        className="me-3 cursor-pointer"
                        style={{ objectFit: 'cover' }}
                        onClick={() => navigate(`/profile/${user.id}`)}
                      />
                      <div className="flex-grow-1">
                        <h6
                          className="mb-0 cursor-pointer fw-bold"
                          onClick={() => navigate(`/profile/${user.id}`)}
                        >
                          {user.firstName} {user.lastName}
                        </h6>
                        <small className="text-muted">@{user.username}</small>
                      </div>
                      <div className="d-flex gap-2 align-items-center">
                        {currentUser?.id !== user.id && (
                          <Button
                            variant={myFollowingIds[user.id] ? 'light' : 'danger'}
                            size="sm"
                            className={`rounded-pill px-3 ${myFollowingIds[user.id] ? 'border' : ''}`}
                            onClick={() => handleFollowToggle(user.id, myFollowingIds[user.id] || false)}
                          >
                            {myFollowingIds[user.id] ? 'Following' : 'Follow'}
                          </Button>
                        )}
                        <Dropdown align="end">
                          <Dropdown.Toggle
                            variant="light"
                            className="rounded-circle p-1 d-flex align-items-center justify-content-center no-caret"
                            style={{ width: '32px', height: '32px' }}
                            id={`dropdown-${user.id}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal size={16} />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleBlock(user.id)} className="text-danger">
                              <UserX size={16} className="me-2" />
                              Block user
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleReport(user.id)} className="text-warning">
                              <Flag size={16} className="me-2" />
                              Report user
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <div className="text-center py-5">
                <p className="text-muted">
                  {searchQuery
                    ? 'No users found matching your search.'
                    : activeTab === 'followers'
                      ? 'No followers yet.'
                      : 'Not following anyone yet.'}
                </p>
              </div>
            )}
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default FollowersPage;
