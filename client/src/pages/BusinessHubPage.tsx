import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button, Spinner, Image, Tabs, Tab } from 'react-bootstrap';
import { Search, Briefcase, Plus, TrendingUp, CheckCircle, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { businessService } from '../services/businessService';
import { collaborationService } from '../services/collaborationService';
import { BusinessProfileResponse } from '../types';
import CreateBusinessProfileModal from '../components/CreateBusinessProfileModal';
import { useAuth } from '../contexts/AuthContext';

const BusinessHubPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [profiles, setProfiles] = useState<BusinessProfileResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [userHasProfile, setUserHasProfile] = useState(false);
    const [activeTab, setActiveTab] = useState('profiles');

    useEffect(() => {
        fetchProfiles();
        checkUserProfile();
    }, [user?.id]);

    const checkUserProfile = async () => {
        if (user?.id) {
            const profile = await businessService.getProfileByUserId(user.id);
            setUserHasProfile(!!profile);
        }
    };

    const fetchProfiles = async () => {
        setIsLoading(true);
        try {
            const data = await businessService.getAllBusinessProfiles();

            // Fetch follower counts for all profiles
            const profilesWithCounts = await Promise.all(data.map(async (profile) => {
                try {
                    const followers = await collaborationService.getFollowers(profile.userId);
                    return { ...profile, followersCount: followers.length };
                } catch (e) {
                    console.error(`Failed to fetch followers for ${profile.businessName}`, e);
                    return profile;
                }
            }));

            setProfiles(profilesWithCounts);
        } catch (error) {
            console.error('Failed to fetch business profiles', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (keyword.trim()) {
                const data = await businessService.searchBusinessProfiles(keyword);

                // Fetch follower counts for search results
                const profilesWithCounts = await Promise.all(data.map(async (profile) => {
                    try {
                        const followers = await collaborationService.getFollowers(profile.userId);
                        return { ...profile, followersCount: followers.length };
                    } catch (e) {
                        return profile;
                    }
                }));

                setProfiles(profilesWithCounts);
            } else {
                await fetchProfiles();
            }
        } catch (error) {
            console.error('Failed to search profiles', error);
        } finally {
            setIsLoading(false);
        }
    };

    const myBusinesses = profiles.filter(p => p.userId === user?.id);
    const otherBusinesses = profiles.filter(p => p.userId !== user?.id);

    const renderProfileCard = (profile: BusinessProfileResponse, isOwn: boolean) => (
        <Col key={profile.id}>
            <Card className="h-100 border shadow-sm hover-shadow transition-all">
                <Card.Body className="p-4">
                    <div className="d-flex align-items-start mb-3">
                        <Image
                            src={profile.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.businessName}`}
                            roundedCircle
                            width={64}
                            height={64}
                            className="border me-3"
                            style={{ objectFit: 'cover' }}
                        />
                        <div className="flex-grow-1 min-w-0">
                            <div className="d-flex align-items-center mb-1">
                                <h6 className="fw-bold mb-0 text-truncate me-1">{profile.businessName}</h6>
                                {profile.isVerified !== false && (
                                    <CheckCircle size={14} className="text-primary flex-shrink-0" fill="currentColor" color="white" />
                                )}
                            </div>
                            <small className="text-muted d-block text-truncate">
                                @{profile.businessName.toLowerCase().replace(/\s+/g, '')}
                            </small>
                        </div>
                    </div>

                    <p className="small text-muted mb-3 line-clamp-2" style={{ minHeight: '40px' }}>
                        {profile.description || 'No description available'}
                    </p>

                    <div className="d-flex align-items-center gap-2 mb-4">
                        <span className="badge bg-light text-dark border fw-normal">
                            {profile.followersCount?.toLocaleString() || 0} followers
                        </span>
                        {profile.category && (
                            <span className="badge bg-light text-dark border fw-normal">
                                {profile.category}
                            </span>
                        )}
                    </div>

                    <div className="d-flex gap-2">
                        <Button
                            variant={isOwn ? "dark" : "danger"}
                            className="flex-grow-1 rounded-pill fw-bold"
                            onClick={() => navigate(`/business/${profile.id}`)}
                        >
                            {isOwn ? 'Manage Profile' : 'View Profile'}
                        </Button>
                        {profile.website && (
                            <Button
                                variant="outline-secondary"
                                className="rounded-circle p-2 d-flex align-items-center justify-content-center"
                                style={{ width: '38px', height: '38px' }}
                                href={profile.website}
                                target="_blank"
                            >
                                <ExternalLink size={18} />
                            </Button>
                        )}
                    </div>
                </Card.Body>
            </Card>
        </Col>
    );

    return (
        <Container className="py-4">
            <div className="mb-4">
                <div className="d-flex align-items-center mb-2">
                    <Briefcase className="text-danger me-2" size={28} />
                    <h2 className="fw-bold mb-0">Business Hub</h2>
                </div>
                <p className="text-muted">Discover inspiring content from businesses and explore sponsored pins</p>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <Tabs
                    activeKey={activeTab}
                    onSelect={(k) => setActiveTab(k || 'profiles')}
                    className="border-bottom-0"
                >
                    <Tab
                        eventKey="profiles"
                        title={
                            <span className="d-flex align-items-center gap-2">
                                <Briefcase size={16} /> Business Profiles
                            </span>
                        }
                    />
                    <Tab
                        eventKey="sponsored"
                        title={
                            <span className="d-flex align-items-center gap-2">
                                <TrendingUp size={16} /> Sponsored Pins
                            </span>
                        }
                    />
                </Tabs>

                {!userHasProfile && (
                    <Button
                        variant="outline-dark"
                        size="sm"
                        className="rounded-pill fw-bold d-flex align-items-center"
                        onClick={() => setShowCreateModal(true)}
                    >
                        <Plus size={16} className="me-1" />
                        Create Profile
                    </Button>
                )}
            </div>

            {activeTab === 'profiles' && (
                <>
                    {isLoading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="danger" />
                        </div>
                    ) : (
                        <>
                            {myBusinesses.length > 0 && (
                                <div className="mb-5">
                                    <h5 className="fw-bold mb-3">My Businesses</h5>
                                    <Row xs={1} md={2} lg={3} className="g-4">
                                        {myBusinesses.map(p => renderProfileCard(p, true))}
                                    </Row>
                                </div>
                            )}

                            <div>
                                <h5 className="fw-bold mb-3">Other Businesses</h5>
                                <Row xs={1} md={2} lg={3} className="g-4">
                                    {otherBusinesses.map(p => renderProfileCard(p, false))}
                                </Row>
                                {otherBusinesses.length === 0 && (
                                    <div className="text-center py-5">
                                        <p className="text-muted">No other business profiles found.</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </>
            )}

            {activeTab === 'sponsored' && (
                <div className="text-center py-5 text-muted">
                    <TrendingUp size={48} className="mb-3" />
                    <h5>Sponsored Pins Coming Soon</h5>
                    <p>Explore promoted content from top brands.</p>
                </div>
            )}

            <CreateBusinessProfileModal
                show={showCreateModal}
                onHide={() => setShowCreateModal(false)}
                onProfileCreated={() => {
                    fetchProfiles();
                    checkUserProfile();
                }}
            />
        </Container>
    );
};

export default BusinessHubPage;
