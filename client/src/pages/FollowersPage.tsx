import React, { useState } from 'react';
import { Container, Nav, Row, Col, Card, Image, Button, Dropdown } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { UserX, Flag } from 'lucide-react';

interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar: string;
  bio?: string;
  isFollowing: boolean;
}

const mockFollowers: User[] = [
  {
    id: '2',
    username: 'sarahdesign',
    firstName: 'Sarah',
    lastName: 'Design',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    bio: 'Interior designer',
    isFollowing: true,
  },
  {
    id: '3',
    username: 'johnphoto',
    firstName: 'John',
    lastName: 'Photo',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    bio: 'Travel photographer',
    isFollowing: false,
  },
  {
    id: '4',
    username: 'emilychef',
    firstName: 'Emily',
    lastName: 'Chef',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    bio: 'Food enthusiast',
    isFollowing: true,
  },
];

const mockFollowing: User[] = [
  {
    id: '5',
    username: 'architecturelover',
    firstName: 'Mike',
    lastName: 'Architecture',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    bio: 'Architecture & design',
    isFollowing: true,
  },
  {
    id: '6',
    username: 'fashionista',
    firstName: 'Jessica',
    lastName: 'Style',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    bio: 'Fashion blogger',
    isFollowing: true,
  },
];

const FollowersPage: React.FC = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('followers');
  const [followers, setFollowers] = useState(mockFollowers);
  const [following, setFollowing] = useState(mockFollowing);

  const handleFollowToggle = (userId: string, currentStatus: boolean, list: 'followers' | 'following') => {
    if (list === 'followers') {
      setFollowers(followers.map(user => 
        user.id === userId ? { ...user, isFollowing: !currentStatus } : user
      ));
    } else {
      setFollowing(following.map(user => 
        user.id === userId ? { ...user, isFollowing: !currentStatus } : user
      ));
    }
  };

  const handleBlock = (userId: string) => {
    if (window.confirm('Are you sure you want to block this user?')) {
      console.log(`Blocking user ${userId}`);
      // In production, this would call the User Service API
    }
  };

  const handleReport = (userId: string) => {
    if (window.confirm('Report this user for inappropriate behavior?')) {
      console.log(`Reporting user ${userId}`);
      // In production, this would call the User Service API
    }
  };

  const UserCard: React.FC<{ user: User; list: 'followers' | 'following' }> = ({ user, list }) => (
    <Card className="mb-3">
      <Card.Body>
        <div className="d-flex align-items-start">
          <Image
            src={user.avatar}
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
            <Button
              variant={user.isFollowing ? 'light' : 'danger'}
              size="sm"
              className="rounded-pill"
              onClick={() => handleFollowToggle(user.id, user.isFollowing, list)}
            >
              {user.isFollowing ? 'Following' : 'Follow'}
            </Button>
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

  return (
    <Container className="py-4">
      <h2 className="mb-4">Connections</h2>

      <Nav variant="tabs" className="mb-4">
        <Nav.Item>
          <Nav.Link
            active={activeTab === 'followers'}
            onClick={() => setActiveTab('followers')}
            className="cursor-pointer"
          >
            Followers ({followers.length})
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            active={activeTab === 'following'}
            onClick={() => setActiveTab('following')}
            className="cursor-pointer"
          >
            Following ({following.length})
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <Row>
        <Col lg={8}>
          {activeTab === 'followers' && (
            <>
              {followers.length > 0 ? (
                followers.map((user) => (
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
              {following.length > 0 ? (
                following.map((user) => (
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
