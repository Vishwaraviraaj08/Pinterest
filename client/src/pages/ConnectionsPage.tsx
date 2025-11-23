import React, { useState } from 'react';
import { Container, Nav, Form, Card, Image, Button } from 'react-bootstrap';
import { MoreVertical, UserMinus, UserPlus } from 'lucide-react';

interface Connection {
  id: string;
  name: string;
  username: string;
  bio: string;
  avatar: string;
  isFollowing: boolean;
}

const mockFollowers: Connection[] = [
  {
    id: '1',
    name: 'Alex Chen',
    username: '@alex_c',
    bio: 'Travel photographer | Capturing moments around the world',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    isFollowing: false,
  },
  {
    id: '2',
    name: 'Maria Garcia',
    username: '@maria_gar',
    bio: 'Food blogger & recipe creator',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    isFollowing: false,
  },
  {
    id: '3',
    name: 'James Park',
    username: '@james_p',
    bio: 'Fashion enthusiast',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    isFollowing: true,
  },
  {
    id: '4',
    name: 'Olivia Martinez',
    username: '@olivia_mart',
    bio: 'Plant mom 🌿 | Green living advocate',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    isFollowing: false,
  },
];

const mockFollowing: Connection[] = [
  {
    id: '5',
    name: 'Alex Chen',
    username: '@alex_c',
    bio: 'Travel photographer | Capturing moments around the world',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    isFollowing: true,
  },
  {
    id: '6',
    name: 'Maria Garcia',
    username: '@maria_gar',
    bio: 'Food blogger & recipe creator',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    isFollowing: true,
  },
  {
    id: '7',
    name: 'Emma Wilson',
    username: '@emma_wil',
    bio: 'Nature lover | Outdoor adventures',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    isFollowing: true,
  },
  {
    id: '8',
    name: 'Olivia Martinez',
    username: '@olivia_mart',
    bio: 'Plant mom 🌿 | Green living advocate',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    isFollowing: true,
  },
];

const ConnectionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>('followers');
  const [followers, setFollowers] = useState(mockFollowers);
  const [following, setFollowing] = useState(mockFollowing);
  const [searchQuery, setSearchQuery] = useState('');

  const handleFollowToggle = (id: string, list: 'followers' | 'following') => {
    if (list === 'followers') {
      setFollowers(
        followers.map((user) =>
          user.id === id ? { ...user, isFollowing: !user.isFollowing } : user
        )
      );
    } else {
      setFollowing(
        following.map((user) =>
          user.id === id ? { ...user, isFollowing: !user.isFollowing } : user
        )
      );
    }
  };

  const filteredConnections = (activeTab === 'followers' ? followers : following).filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container style={{ maxWidth: '800px', marginTop: '80px' }}>
      {/* Header */}
      <h4 className="mb-4">Connections</h4>

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
              Followers ({followers.length})
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
              Following ({following.length})
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
                      backgroundImage: `url(${user.avatar})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-0">{user.name}</h6>
                  <small className="text-muted d-block">{user.username}</small>
                  <small className="text-muted">{user.bio}</small>
                </div>
                <div className="d-flex gap-2 align-items-center">
                  <Button
                    variant={user.isFollowing ? 'light' : 'danger'}
                    size="sm"
                    className="rounded-pill d-flex align-items-center gap-2"
                    onClick={() => handleFollowToggle(user.id, activeTab)}
                    style={{
                      backgroundColor: user.isFollowing ? '#efefef' : '#e60023',
                      borderColor: user.isFollowing ? '#efefef' : '#e60023',
                      color: user.isFollowing ? '#000' : '#fff',
                      padding: '6px 16px',
                    }}
                  >
                    {user.isFollowing ? (
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