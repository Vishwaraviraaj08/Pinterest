import React, { useState, useEffect } from 'react';
import { Container, Nav, Form, Card, Image, Button, Spinner, Alert } from 'react-bootstrap';
import { MoreVertical, UserMinus, UserPlus } from 'lucide-react';
import { useConnections } from '../contexts/ConnectionContext';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { ConnectionResponse, UserResponse } from '../types';

interface ConnectionUI extends UserResponse {
  connectionId: number; // ID of the connection record
  isFollowing: boolean;
}

const ConnectionsPage: React.FC = () => {
  const { user } = useAuth();
  const { followers, following, fetchFollowers, fetchFollowing, followUser, unfollowUser, isLoading: isConnLoading, error: connError } = useConnections();
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>('followers');
  const [enrichedFollowers, setEnrichedFollowers] = useState<ConnectionUI[]>([]);
  const [enrichedFollowing, setEnrichedFollowing] = useState<ConnectionUI[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [myFollowingIds, setMyFollowingIds] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (user?.id) {
      fetchFollowers(user.id);
      fetchFollowing(user.id);
    }
  }, [user?.id, fetchFollowers, fetchFollowing]);

  // Populate myFollowingIds from the following array
  useEffect(() => {
    const ids: Record<number, boolean> = {};
    following.forEach(conn => {
      ids[conn.followingId] = true;
    });
    setMyFollowingIds(ids);
  }, [following]);

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
                console.error(`Failed to fetch profile for follower ${conn.followerId}`, e);
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
                console.error(`Failed to fetch profile for following ${conn.followingId}`, e);
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

  // Separate effect to update isFollowing status when myFollowingIds changes
  useEffect(() => {
    setEnrichedFollowers(prev => 
      prev.map(user => ({
        ...user,
        isFollowing: myFollowingIds[user.id] || false
      }))
    );
    setEnrichedFollowing(prev => 
      prev.map(user => ({
        ...user,
        isFollowing: myFollowingIds[user.id] || false
      }))
    );
  }, [myFollowingIds]);

  const handleFollowToggle = async (userId: number, currentStatus: boolean) => {
    try {
      if (currentStatus) {
        await unfollowUser(userId);
        setMyFollowingIds(prev => {
          const next = { ...prev };
          delete next[userId];
          return next;
        });
      } else {
        await followUser(userId);
        setMyFollowingIds(prev => ({
          ...prev,
          [userId]: true
        }));
      }

      // If we are on our own connections page, refresh the following list
      if (user?.id) {
        fetchFollowing(user.id);
      }
    } catch (error: any) {
      // Handle "Already following" error by syncing local state
      if (error.response?.status === 400) {
        setMyFollowingIds(prev => ({
          ...prev,
          [userId]: true
        }));
        if (user?.id) {
          fetchFollowing(user.id);
        }
      } else {
        console.error('Failed to update connection:', error);
      }
    }
  };

  const currentList = activeTab === 'followers' ? enrichedFollowers : enrichedFollowing;

  const filteredConnections = currentList.filter(
    (user) =>
      (user.firstName + ' ' + user.lastName).toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isLoading = isConnLoading || isLoadingDetails;

  if (isLoading && currentList.length === 0) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="danger" />
      </div>
    );
  }

  return (
    <Container style={{ maxWidth: '800px', marginTop: '80px' }}>
      {/* Header */}
      <h4 className="mb-4">Connections</h4>

      {connError && <Alert variant="danger">{connError}</Alert>}

      {/* Tabs */}
      <div className="mb-4">
        <Nav variant="tabs">
          <Nav.Item>
            <Nav.Link
              active={activeTab === 'followers'}
              onClick={() => setActiveTab('followers')}
              className="cursor-pointer"
              style={{
                borderBottom: activeTab === 'followers' ? '3px solid #000' : '3px solid transparent',
                color: activeTab === 'followers' ? '#000' : '#4a5565',
              }}
            >
              Followers ({enrichedFollowers.length})
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              active={activeTab === 'following'}
              onClick={() => setActiveTab('following')}
              className="cursor-pointer"
              style={{
                borderBottom: activeTab === 'following' ? '3px solid #000' : '3px solid transparent',
                color: activeTab === 'following' ? '#000' : '#4a5565',
              }}
            >
              Following ({enrichedFollowing.length})
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>

      {/* Search */}
      <Form.Control
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4"
        style={{
          borderRadius: '24px',
          padding: '12px 20px',
          backgroundColor: '#efefef',
          border: 'none',
        }}
      />

      {/* Connections List */}
      <div className="d-flex flex-column gap-3">
        {filteredConnections.map((user) => (
          <Card key={user.id} className="border" style={{ borderRadius: '12px' }}>
            <Card.Body className="p-3">
              <div className="d-flex align-items-center gap-3">
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    minWidth: '56px',
                    minHeight: '56px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundImage: `url(${user.avatar || '/default-avatar.svg'})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-0">{user.firstName} {user.lastName}</h6>
                  <small className="text-muted d-block">@{user.username}</small>
                  <small className="text-muted">{user.bio}</small>
                </div>
                <div className="d-flex gap-2 align-items-center">
                  <Button
                    variant={myFollowingIds[user.id] ? 'light' : 'danger'}
                    size="sm"
                    className="rounded-pill d-flex align-items-center gap-2"
                    onClick={() => handleFollowToggle(user.id, myFollowingIds[user.id] || false)}
                    style={{
                      backgroundColor: myFollowingIds[user.id] ? '#efefef' : '#e60023',
                      borderColor: myFollowingIds[user.id] ? '#efefef' : '#e60023',
                      color: myFollowingIds[user.id] ? '#000' : '#fff',
                      padding: '6px 16px',
                    }}
                  >
                    {myFollowingIds[user.id] ? (
                      <>
                        <UserMinus size={14} />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus size={14} />
                        Follow
                      </>
                    )}
                  </Button>
                  <Button
                    variant="light"
                    size="sm"
                    className="rounded-circle p-1"
                    style={{ width: '32px', height: '32px', minWidth: '32px', minHeight: '32px' }}
                  >
                    <MoreVertical size={16} />
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      {filteredConnections.length === 0 && (
        <div className="text-center py-5">
          <p className="text-muted">No connections found</p>
        </div>
      )}
    </Container>
  );
};

export default ConnectionsPage;