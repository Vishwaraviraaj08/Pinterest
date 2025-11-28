import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Image, Button, Tabs, Tab, Spinner, Modal, Dropdown } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { Globe, Share2, MoreHorizontal, Layout, Mail, Flag, Ban, CheckCircle, Edit, Plus } from 'lucide-react';
import { businessService } from '../services/businessService';
import { contentService } from '../services/contentService';
import { collaborationService } from '../services/collaborationService';
import { useAuth } from '../contexts/AuthContext';
import { BusinessProfileResponse, BoardResponse } from '../types';
import BoardCard from '../components/BoardCard';
import EditBusinessProfileModal from '../components/EditBusinessProfileModal';
import CreateBoardModal from '../components/CreateBoardModal';

const BusinessProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [profile, setProfile] = useState<BusinessProfileResponse | null>(null);
    const [boards, setBoards] = useState<BoardResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateShowcaseModal, setShowCreateShowcaseModal] = useState(false);

    const fetchData = async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const profileData = await businessService.getBusinessProfile(id);
            setProfile(profileData);

            // Fetch boards
            const boardsData = await contentService.getUserBoards(profileData.userId);
            setBoards(boardsData);

            // Check follow status
            if (user?.id && user.id !== profileData.userId) {
                const following = await collaborationService.getFollowing(user.id);
                setIsFollowing(following.some(f => f.followingId === profileData.userId));
            }

            // Fetch real follower count
            try {
                const followers = await collaborationService.getFollowers(profileData.userId);
                setProfile(prev => prev ? { ...prev, followersCount: followers.length } : null);
            } catch (e) {
                console.error("Failed to fetch followers count", e);
            }

        } catch (error) {
            console.error('Failed to fetch business profile data', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id, user?.id]);

    const handleFollow = async () => {
        if (!profile || !user?.id) return;
        try {
            if (isFollowing) {
                await collaborationService.unfollowUser(profile.userId);
            } else {
                await collaborationService.followUser(profile.userId);
            }
            setIsFollowing(!isFollowing);

            // Refresh follower count
            const followers = await collaborationService.getFollowers(profile.userId);
            setProfile(prev => prev ? { ...prev, followersCount: followers.length } : null);

        } catch (error) {
            console.error('Failed to toggle follow', error);
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Profile link copied to clipboard!');
    };

    const handleBlock = () => {
        if (window.confirm(`Are you sure you want to block ${profile?.businessName}?`)) {
            console.log('Blocked user:', profile?.userId);
            // Implement block logic here
        }
    };

    const handleReport = () => {
        console.log('Reported user:', profile?.userId);
        alert('Thank you for your report. We will review this profile.');
        // Implement report logic here
    };

    if (isLoading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" variant="danger" />
            </Container>
        );
    }

    if (!profile) {
        return (
            <Container className="py-5 text-center">
                <h3>Business Profile Not Found</h3>
            </Container>
        );
    }

    const showcases = boards.filter(b => b.boardType === 'SHOWCASE');
    const regularBoards = boards.filter(b => b.boardType !== 'SHOWCASE');
    const isOwnProfile = user?.id === profile.userId;

    return (
        <Container fluid className="p-0">
            <Container className="py-5">
                <div className="text-center mb-5">
                    <div className="mb-3 position-relative d-inline-block">
                        <Image
                            src={profile.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.businessName}`}
                            roundedCircle
                            width={160}
                            height={160}
                            className="border shadow-sm"
                            style={{ objectFit: 'cover' }}
                        />
                    </div>

                    <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                        <h1 className="fw-bold mb-0">{profile.businessName}</h1>
                        {profile.isVerified !== false && (
                            <CheckCircle size={24} className="text-primary" fill="currentColor" color="white" />
                        )}
                    </div>

                    <p className="text-muted mb-3">@{profile.businessName.toLowerCase().replace(/\s+/g, '')}</p>

                    {profile.description && (
                        <p className="lead mb-3 mx-auto" style={{ maxWidth: '600px' }}>
                            {profile.description}
                        </p>
                    )}

                    <div className="d-flex justify-content-center align-items-center gap-3 mb-4 text-muted">
                        {profile.category && <span>{profile.category}</span>}
                        {profile.followersCount != null && (
                            <span>{(profile.followersCount || 0).toLocaleString()} followers</span>
                        )}
                        {profile.website && (
                            <a
                                href={profile.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-dark fw-bold text-decoration-none d-flex align-items-center"
                            >
                                <Globe size={16} className="me-1" />
                                {profile.website.replace(/^https?:\/\//, '')}
                            </a>
                        )}
                    </div>

                    <div className="d-flex justify-content-center gap-2 mb-5">
                        {isOwnProfile ? (
                            <>
                                <Button
                                    variant="dark"
                                    className="rounded-pill px-4 fw-bold d-flex align-items-center"
                                    onClick={() => setShowEditModal(true)}
                                >
                                    <Edit size={18} className="me-2" /> Edit Profile
                                </Button>
                                <Button
                                    variant="light"
                                    className="rounded-pill px-4 fw-bold border d-flex align-items-center"
                                    onClick={() => setShowCreateShowcaseModal(true)}
                                >
                                    <Plus size={18} className="me-2" /> Create Showcase
                                </Button>
                                <Button
                                    variant="light"
                                    className="rounded-circle p-2 border"
                                    onClick={handleShare}
                                    title="Share"
                                >
                                    <Share2 size={20} />
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant={isFollowing ? "dark" : "danger"}
                                    className="rounded-pill px-4 fw-bold"
                                    onClick={handleFollow}
                                >
                                    {isFollowing ? 'Following' : 'Follow'}
                                </Button>
                                <Button
                                    variant="light"
                                    className="rounded-pill px-3 border fw-bold"
                                    onClick={() => setShowContactModal(true)}
                                >
                                    Contact
                                </Button>
                                <Button
                                    variant="light"
                                    className="rounded-circle p-2 border"
                                    onClick={handleShare}
                                    title="Share"
                                >
                                    <Share2 size={20} />
                                </Button>

                                <Dropdown>
                                    <Dropdown.Toggle variant="light" className="rounded-circle p-2 border no-caret" id="dropdown-basic">
                                        <MoreHorizontal size={20} />
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={handleBlock} className="text-danger">
                                            <Ban size={16} className="me-2" /> Block
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={handleReport} className="text-danger">
                                            <Flag size={16} className="me-2" /> Report
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </>
                        )}
                    </div>

                    <Tabs defaultActiveKey="showcases" className="justify-content-center mb-4 border-0">
                        <Tab eventKey="showcases" title="Showcases">
                            {showcases.length > 0 ? (
                                <Row xs={1} sm={2} md={3} lg={4} className="g-4 text-start mt-2">
                                    {showcases.map(board => (
                                        <Col key={board.id}>
                                            <BoardCard board={board} />
                                        </Col>
                                    ))}
                                </Row>
                            ) : (
                                <div className="text-center py-5 text-muted d-flex flex-column align-items-center">
                                    <Layout size={48} strokeWidth={1} className="mb-3" />
                                    <h5>No showcases yet</h5>
                                    <p>Check back later for curated collections.</p>
                                </div>
                            )}
                        </Tab>
                        <Tab eventKey="boards" title="All Boards">
                            {regularBoards.length > 0 ? (
                                <Row xs={1} sm={2} md={3} lg={4} className="g-4 text-start mt-2">
                                    {regularBoards.map(board => (
                                        <Col key={board.id}>
                                            <BoardCard board={board} />
                                        </Col>
                                    ))}
                                </Row>
                            ) : (
                                <div className="text-center py-5 text-muted">
                                    <h5>No boards yet</h5>
                                </div>
                            )}
                        </Tab>
                    </Tabs>
                </div>
            </Container>

            {/* Modals */}
            <Modal show={showContactModal} onHide={() => setShowContactModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Contact {(profile?.businessName || "")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-grid gap-3">
                        {profile?.website && (
                            <Button variant="outline-dark" href={profile?.website} target="_blank" className="d-flex align-items-center justify-content-center gap-2">
                                <Globe size={20} /> Visit Website
                            </Button>
                        )}
                        <Button variant="outline-dark" href={`mailto:contact@${profile?.businessName.toLowerCase().replace(/\s+/g, '')}.com`} className="d-flex align-items-center justify-content-center gap-2">
                            <Mail size={20} /> Send Email
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>

            {isOwnProfile && (
                <>
                    <EditBusinessProfileModal
                        show={showEditModal}
                        onHide={() => setShowEditModal(false)}
                        profile={profile}
                        onProfileUpdated={fetchData}
                    />
                    <CreateBoardModal
                        show={showCreateShowcaseModal}
                        onHide={() => setShowCreateShowcaseModal(false)}
                        onBoardCreated={fetchData}
                        initialBoardType="SHOWCASE"
                    />
                </>
            )}
        </Container>
    );
};

export default BusinessProfilePage;
