import React, { useState } from 'react';
import { Container, Row, Col, Card, Image, Button, Badge, Form, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Search, Briefcase, CheckCircle } from 'lucide-react';

interface BusinessProfile {
  id: string;
  name: string;
  username: string;
  logo: string;
  description: string;
  website: string;
  category: string;
  followers: number;
  pins: number;
  isFollowing: boolean;
  isVerified: boolean;
}

const mockBusinessProfiles: BusinessProfile[] = [
  {
    id: 'b1',
    name: 'Home Decor Studio',
    username: '@homedecor_stu',
    logo: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200',
    description: 'Premium home decor and interior design inspiration',
    website: 'https://www.homedecor.com',
    category: 'Home & Garden',
    followers: 45000,
    pins: 15000,
    isFollowing: false,
    isVerified: true,
  },
  {
    id: 'b2',
    name: 'Fashion Forward',
    username: '@fashion_forw',
    logo: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200',
    description: 'Latest fashion trends and style inspiration',
    website: 'https://www.fashionforward.com',
    category: 'Fashion',
    followers: 128000,
    pins: 22000,
    isFollowing: false,
    isVerified: true,
  },
  {
    id: 'b3',
    name: 'Culinary Creations',
    username: '@culinary_creati',
    logo: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200',
    description: 'Gourmet recipes and cooking inspiration',
    website: 'https://www.culinarycreations.com',
    category: 'Food & Drink',
    followers: 92000,
    pins: 35000,
    isFollowing: false,
    isVerified: true,
  },
];

const BusinessProfilesPage: React.FC = () => {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState(mockBusinessProfiles);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState<'sponsored' | 'profiles'>('profiles');

  const categories = ['all', 'Home & Garden', 'Food & Drink', 'Fashion', 'Beauty', 'Technology'];

  const handleFollowToggle = (businessId: string) => {
    setBusinesses(
      businesses.map((business) =>
        business.id === businessId
          ? { ...business, isFollowing: !business.isFollowing }
          : business
      )
    );
  };

  const filteredBusinesses = businesses.filter((business) => {
    const matchesSearch =
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || business.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Container className="py-4" style={{ marginTop: '80px' }}>
      {/* Header */}
      <div className="mb-4">
        <div className="d-flex align-items-center gap-2 mb-2">
          <Briefcase size={24} color="#e60023" />
          <h4 className="mb-0">Business Hub</h4>
        </div>
        <p className="text-muted mb-0">
          Discover inspiring content from businesses and explore sponsored pins
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-4">
        <Nav variant="tabs">
          <Nav.Item>
            <Nav.Link
              active={activeTab === 'sponsored'}
              onClick={() => setActiveTab('sponsored')}
              className="cursor-pointer d-flex align-items-center gap-2"
              style={{
                borderBottom:
                  activeTab === 'sponsored' ? '3px solid #000' : '3px solid transparent',
                color: activeTab === 'sponsored' ? '#000' : '#4a5565',
                fontWeight: 'normal',
              }}
            >
              <ExternalLink size={16} />
              Sponsored Pins
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              active={activeTab === 'profiles'}
              onClick={() => setActiveTab('profiles')}
              className="cursor-pointer d-flex align-items-center gap-2"
              style={{
                borderBottom:
                  activeTab === 'profiles' ? '3px solid #000' : '3px solid transparent',
                color: activeTab === 'profiles' ? '#000' : '#4a5565',
                fontWeight: 'normal',
              }}
            >
              <Briefcase size={16} />
              Business Profiles
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>

      {activeTab === 'profiles' && (
        <>
          {/* Search and Filter */}
          <Row className="mb-4">
            <Col md={8}>
              <div className="position-relative">
                <Search
                  className="position-absolute"
                  style={{ left: '12px', top: '12px', color: '#5f5f5f' }}
                  size={20}
                />
                <Form.Control
                  type="text"
                  placeholder="Search business profiles..."
                  className="ps-5"
                  style={{
                    borderRadius: '24px',
                    backgroundColor: '#efefef',
                    border: 'none',
                    padding: '12px 16px',
                  }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </Col>
            <Col md={4}>
              <Form.Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  borderRadius: '24px',
                  backgroundColor: '#efefef',
                  border: 'none',
                  padding: '12px 16px',
                }}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>

          {/* Business Profiles Grid */}
          <Row>
            {filteredBusinesses.map((business) => (
              <Col key={business.id} lg={4} md={6} className="mb-4">
                <Card
                  className="border h-100"
                  style={{
                    borderRadius: '16px',
                    borderColor: '#e1e1e1',
                    transition: 'box-shadow 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)')
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
                >
                  <Card.Body className="p-4 d-flex flex-column">
                    <div className="d-flex align-items-start mb-3">
                      <div
                        style={{
                          width: '64px',
                          height: '64px',
                          minWidth: '64px',
                          minHeight: '64px',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          marginRight: '12px',
                        }}
                      >
                        <div
                          style={{
                            width: '100%',
                            height: '100%',
                            backgroundImage: `url(${business.logo})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        />
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-1 mb-1">
                          <h6 className="mb-0">{business.name}</h6>
                          {business.isVerified && (
                            <CheckCircle size={16} color="#0074d9" fill="#0074d9" />
                          )}
                        </div>
                        <small className="text-muted">{business.username}</small>
                      </div>
                    </div>

                    <p className="text-muted mb-3 flex-grow-1" style={{ fontSize: '14px' }}>
                      {business.description}
                    </p>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <div>
                          <strong>{(business.followers / 1000).toFixed(0)}k</strong>
                          <small className="text-muted ms-1">followers</small>
                        </div>
                      </div>
                      <Badge
                        bg="light"
                        text="dark"
                        className="rounded-pill"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        {business.category}
                      </Badge>
                    </div>

                    <div className="d-flex gap-2">
                      <Button
                        variant={business.isFollowing ? 'light' : 'danger'}
                        className="rounded-pill flex-grow-1"
                        onClick={() => handleFollowToggle(business.id)}
                        style={{
                          backgroundColor: business.isFollowing ? '#efefef' : '#e60023',
                          borderColor: business.isFollowing ? '#efefef' : '#e60023',
                          color: business.isFollowing ? '#000' : '#fff',
                        }}
                      >
                        {business.isFollowing ? 'Following' : 'Follow'}
                      </Button>
                      <Button
                        variant="light"
                        className="rounded-circle"
                        href={business.website}
                        target="_blank"
                        style={{
                          width: '44px',
                          height: '44px',
                          minWidth: '44px',
                          minHeight: '44px',
                          padding: '0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#efefef',
                          border: 'none',
                        }}
                      >
                        <ExternalLink size={20} />
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {filteredBusinesses.length === 0 && (
            <div className="text-center py-5">
              <h5 className="mb-3">No business profiles found</h5>
              <p className="text-muted">Try adjusting your search or filters</p>
            </div>
          )}
        </>
      )}

      {activeTab === 'sponsored' && (
        <div className="text-center py-5">
          <h5 className="mb-3">Sponsored Pins</h5>
          <p className="text-muted">Explore sponsored content from businesses</p>
        </div>
      )}
    </Container>
  );
};

export default BusinessProfilesPage;