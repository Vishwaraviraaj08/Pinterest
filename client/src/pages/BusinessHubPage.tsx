import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button, Spinner, Image, Tabs, Tab } from 'react-bootstrap';
import { Search, Briefcase, Plus, TrendingUp, CheckCircle, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { businessService } from '../services/businessService';
import { collaborationService } from '../services/collaborationService';
import { contentService } from '../services/contentService';
import { BusinessProfileResponse, Pin } from '../types';
import CreateBusinessProfileModal from '../components/CreateBusinessProfileModal';
import CreateSponsoredPinModal from '../components/CreateSponsoredPinModal';
import SponsoredPinCard from '../components/SponsoredPinCard';
import SponsoredPinDetailModal from '../components/SponsoredPinDetailModal';
import { useAuth } from '../contexts/AuthContext';

const BusinessHubPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [profiles, setProfiles] = useState<BusinessProfileResponse[]>([]);
    const [sponsoredPins, setSponsoredPins] = useState<Pin[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showSponsoredModal, setShowSponsoredModal] = useState(false);
    const [editingPin, setEditingPin] = useState<Pin | null>(null);
    const [selectedSponsoredPin, setSelectedSponsoredPin] = useState<Pin | null>(null);
    const [userHasProfile, setUserHasProfile] = useState(false);
    const [activeTab, setActiveTab] = useState('profiles');

    const [followingIds, setFollowingIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        if (activeTab === 'profiles') {
            fetchProfiles();
        } else if (activeTab === 'sponsored') {
            fetchSponsoredPins();
        }
        checkUserProfile();
        if (user?.id) {
            fetchFollowing();
        }
    }, [user?.id, activeTab]);

    const fetchFollowing = async () => {
        if (!user?.id) return;
        try {
            const following = await collaborationService.getFollowing(user.id);
            setFollowingIds(new Set(following.map(f => f.followingId)));
        } catch (error) {
            console.error('Failed to fetch following', error);
        }
    };

    const handleFollowUser = async (userId: number) => {
        if (!user?.id) return;
        try {
            if (followingIds.has(userId)) {
                await collaborationService.unfollowUser(userId);
                setFollowingIds(prev => {
                    const next = new Set(prev);
                    next.delete(userId);
                    return next;
                });
            } else {
                await collaborationService.followUser(userId);
                setFollowingIds(prev => {
                    const next = new Set(prev);
                    next.add(userId);
                    return next;
                });
            }
        } catch (error) {
            console.error('Failed to toggle follow', error);
        }
    };

    const checkUserProfile = async () => {
        if (user?.id) {
            const profile = await businessService.getProfileByUserId(user.id);
            setUserHasProfile(!!profile);
        }
    };

    const fetchSponsoredPins = async () => {
        setIsLoading(true);
        try {
            const data = await contentService.getSponsoredPins();
            setSponsoredPins(data);
        } catch (error) {
            console.error('Failed to fetch sponsored pins', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteSponsoredPin = async (pinId: number) => {
        if (window.confirm('Are you sure you want to delete this campaign?')) {
            try {
                await contentService.deletePin(pinId);
                fetchSponsoredPins();
            } catch (error) {
                console.error('Failed to delete pin', error);
            }
        }
    };

    const fetchProfiles = async () => {
        setIsLoading(true);
        try {
            const data = await businessService.getAllBusinessProfiles();

            
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
                <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h5 className="fw-bold mb-1">Active Campaigns</h5>
                            <p className="text-muted mb-0">Manage your sponsored content and track performance</p>
                        </div>
                        <Button
                            variant="danger"
                            className="rounded-pill fw-bold d-flex align-items-center"
                            onClick={() => {
                                setEditingPin(null);
                                setShowSponsoredModal(true);
                            }}
                        >
                            <Plus size={18} className="me-2" />
                            Create Campaign
                        </Button>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="danger" />
                        </div>
                    ) : sponsoredPins.length > 0 ? (
                        <Row xs={1} md={2} lg={3} xl={4} className="g-4">
                            {sponsoredPins.map(pin => (
                                <Col key={pin.id}>
                                    <SponsoredPinCard
                                        pin={pin}
                                        isOwner={pin.userId === user?.id}
                                        isFollowing={followingIds.has(pin.userId)}
                                        onEdit={(p: Pin) => {
                                            setEditingPin(p);
                                            setShowSponsoredModal(true);
                                        }}
                                        onDelete={handleDeleteSponsoredPin}
                                        onFollow={handleFollowUser}
                                        onClick={(p: Pin) => setSelectedSponsoredPin(p)}
                                    />
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <div className="text-center py-5 bg-light rounded-3">
                            <TrendingUp size={48} className="mb-3 text-muted" />
                            <h5>No Active Campaigns</h5>
                            <p className="text-muted mb-4">Start promoting your business to reach more customers.</p>
                            <Button
                                variant="outline-danger"
                                className="rounded-pill fw-bold"
                                onClick={() => {
                                    setEditingPin(null);
                                    setShowSponsoredModal(true);
                                }}
                            >
                                Create First Campaign
                            </Button>
                        </div>
                    )}
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

            <CreateSponsoredPinModal
                show={showSponsoredModal}
                onHide={() => setShowSponsoredModal(false)}
                onSuccess={() => {
                    fetchSponsoredPins();
                    setShowSponsoredModal(false);
                }}
                editingPin={editingPin}
            />

            {selectedSponsoredPin && (
                <SponsoredPinDetailModal
                    show={!!selectedSponsoredPin}
                    onHide={() => setSelectedSponsoredPin(null)}
                    pin={selectedSponsoredPin}
                    isOwner={selectedSponsoredPin.userId === user?.id}
                    isFollowing={followingIds.has(selectedSponsoredPin.userId)}
                    onFollow={handleFollowUser}
                />
            )}
        </Container>
    );
};

export default BusinessHubPage;
