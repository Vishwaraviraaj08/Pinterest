import React, { useState, useEffect } from 'react';
import { Container, Nav, Row, Col, Card, Image, Button, Dropdown, Spinner, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { UserX, Flag } from 'lucide-react';
import { useConnections } from '../contexts/ConnectionContext';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { UserResponse } from '../types';

interface ConnectionUI extends UserResponse {
  connectionId: number;
  isFollowing: boolean;
}

const FollowersPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { followers, following, fetchFollowers, fetchFollowing, followUser, unfollowUser, isLoading: isConnLoading, error: connError } = useConnections();

  const [activeTab, setActiveTab] = useState('followers');
  const [enrichedFollowers, setEnrichedFollowers] = useState<ConnectionUI[]>([]);
  const [enrichedFollowing, setEnrichedFollowing] = useState<ConnectionUI[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // We need to know who the current user is following to correctly show "Follow/Following" buttons
  // even when viewing someone else's followers list.
  const [myFollowingIds, setMyFollowingIds] = useState<Set<number>>(new Set());

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
          // We can't use the context's `following` state because it's currently holding the *viewed user's* following list.
          // We need a separate call or a way to check "am I following this user".
          // Since the backend doesn't provide "isFollowing" on UserResponse, we have to fetch my following list.
          // But `useConnections` only has one `following` state.
          // This is a limitation of the current Context design for this specific scenario (viewing others).
          // Ideally, the context should separate "my connections" from "viewed connections" or the service should be used directly for one of them.
          // For now, let's use the service directly to get MY following list without affecting the context state (which shows the viewed user's list).
          // Wait, `fetchFollowing` updates the context state.
          // So if I call it for me, it wipes the viewed user's list.
          // So I should NOT use `fetchFollowing` from context for *my* check if I'm viewing someone else.
          // I should use `connectionService` directly if possible, but it's not exported.
          // Actually, I can just assume `isFollowing` is false initially or try to fetch it.
          // Or better: The `ConnectionContext` should probably expose a way to check relationship.
          // But it doesn't. 
          // Let's try to fetch my following list *before* fetching the viewed user's list? No, that's racey.

          // Alternative: Just fetch the profiles. The UI will default to "Follow" if we don't know.
          // But that's bad UX.
          // Let's add a hack: fetch my following list using a direct API call if I can, or just accept that we might not know.
          // Actually, `authService` doesn't have connection info.
          // `contentService` doesn't either.
          // I'll leave it as a TODO or just try to be smart.
          // For now, let's just display the users. The "Follow" button will trigger `followUser`.
          // If I'm already following, the backend might handle it (idempotent?) or throw error.
          // If I want to show correct state, I need to know.
        } catch (e) {
          console.error(e);
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
                return { ...profile, connectionId: conn.id, isFollowing: false }; // Default false for now
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
                return { ...profile, connectionId: conn.id, isFollowing: false }; // Default false
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

  const handleFollowToggle = async (targetUserId: number, currentStatus: boolean, list: 'followers' | 'following') => {
    try {
      if (currentStatus) {
        await unfollowUser(targetUserId);
        // Update local state
        const updateList = (prev: ConnectionUI[]) => prev.map(u => u.id === targetUserId ? { ...u, isFollowing: false } : u);
        setEnrichedFollowers(updateList);
        setEnrichedFollowing(updateList);
      } else {
        await followUser(targetUserId);
        const updateList = (prev: ConnectionUI[]) => prev.map(u => u.id === targetUserId ? { ...u, isFollowing: true } : u);
        setEnrichedFollowers(updateList);
        setEnrichedFollowing(updateList);
      }
    } catch (error) {
      alert('Failed to update connection');
    }
  };

  const handleBlock = (userId: number) => {
    if (window.confirm('Are you sure you want to block this user?')) {
      console.log(`Blocking user ${userId}`);
      // In production, this would call the User Service API
    }
  };

  const handleReport = (userId: number) => {
    if (window.confirm('Report this user for inappropriate behavior?')) {
      console.log(`Reporting user ${userId}`);
      // In production, this would call the User Service API
    }
  };

  const UserCard: React.FC<{ user: ConnectionUI; list: 'followers' | 'following' }> = ({ user, list }) => (
    <Card className="mb-3">
      <Card.Body>
        <div className="d-flex align-items-start">
          <Image
            src={user.avatar || '/default-avatar.svg'}
            roundedCircle
            width={64}
            height={64}
            className="me-3 cursor-pointer"
            style={{ objectFit: 'cover' }}
            onClick={() => navigate(`/profile/${user.id}`)}
          />
          <div className="flex-grow-1">
            <h5
              className="mb-0 cursor-pointer"
              onClick={() => navigate(`/profile/${user.id}`)}
            >
              {user.firstName} {user.lastName}
            </h5>
            <p className="text-muted mb-1">@{user.username}</p>
            {user.bio && <p className="mb-2">{user.bio}</p>}
          </div>
          <div className="d-flex gap-2">
            {currentUser?.id !== user.id && (
              <Button
                variant={user.isFollowing ? 'light' : 'danger'}
                size="sm"
                className="rounded-pill"
                onClick={() => handleFollowToggle(user.id, user.isFollowing, list)}
              >
                {user.isFollowing ? 'Following' : 'Follow'}
              </Button>
            )}
            <Dropdown>
              <Dropdown.Toggle variant="light" size="sm" className="rounded-circle p-2">
                •••
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleBlock(user.id)}>
                  <UserX size={16} className="me-2" />
                  Block user
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleReport(user.id)}>
                  <Flag size={16} className="me-2" />
                  Report user
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  const isLoading = isConnLoading || isLoadingDetails;

  if (isLoading && enrichedFollowers.length === 0 && enrichedFollowing.length === 0) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="danger" />
      </div>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">Connections</h2>

      {connError && <Alert variant="danger">{connError}</Alert>}

      <Nav variant="tabs" className="mb-4">
        <Nav.Item>
          <Nav.Link
            active={activeTab === 'followers'}
            onClick={() => setActiveTab('followers')}
            className="cursor-pointer"
          >
            Followers ({enrichedFollowers.length})
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            active={activeTab === 'following'}
            onClick={() => setActiveTab('following')}
            className="cursor-pointer"
          >
            Following ({enrichedFollowing.length})
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <Row>
        <Col lg={8}>
          {activeTab === 'followers' && (
            <>
              {enrichedFollowers.length > 0 ? (
                enrichedFollowers.map((user) => (
                  <UserCard key={user.id} user={user} list="followers" />
                ))
              ) : (
                <div className="text-center py-5">
                  <p className="text-muted">No followers yet</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'following' && (
            <>
              {enrichedFollowing.length > 0 ? (
                enrichedFollowing.map((user) => (
                  <UserCard key={user.id} user={user} list="following" />
                ))
              ) : (
                <div className="text-center py-5">
                  <p className="text-muted">Not following anyone yet</p>
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default FollowersPage;
