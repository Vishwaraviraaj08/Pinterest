import React from 'react';
import { Modal, Button, Badge } from 'react-bootstrap';
import { Pin } from '../types';
import { ExternalLink, TrendingUp, Heart, MessageCircle, Share2, X } from 'lucide-react';

interface SponsoredPinDetailModalProps {
    show: boolean;
    onHide: () => void;
    pin: Pin;
    isOwner: boolean;
    isFollowing: boolean;
    onFollow: (userId: number) => void;
}

const SponsoredPinDetailModal: React.FC<SponsoredPinDetailModalProps> = ({
    show,
    onHide,
    pin,
    isOwner,
    isFollowing,
    onFollow
}) => {
    return (
        <Modal
            show={show}
            onHide={onHide}
            size="xl"
            centered
            contentClassName="border-0"
            dialogClassName="modal-pin-detail"
            backdropClassName="modal-backdrop-blur"
        >
            <Modal.Body className="p-0" style={{ borderRadius: '16px', overflow: 'hidden', height: '85vh', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)' }}>
                <div className="row g-0 h-100">
                    {/* Left Side - Image */}
                    <div className="col-md-7 bg-black d-flex align-items-center justify-content-center position-relative">
                        <div
                            className="position-absolute w-100 h-100"
                            style={{
                                backgroundImage: `url(${pin.imageUrl})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                filter: 'blur(20px)',
                                opacity: 0.3
                            }}
                        />
                        <img
                            src={pin.imageUrl}
                            alt={pin.title}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                width: 'auto',
                                height: 'auto',
                                objectFit: 'contain',
                                position: 'relative',
                                zIndex: 1,
                                boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                            }}
                        />
                        <Button
                            variant="light"
                            className="position-absolute top-0 start-0 m-4 rounded-circle p-2 d-md-none"
                            onClick={onHide}
                            style={{ zIndex: 10 }}
                        >
                            <X size={24} />
                        </Button>
                    </div>

                    {/* Right Side - Content */}
                    <div className="col-md-5 bg-white d-flex flex-column h-100">
                        {/* Header */}
                        <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-3">
                                <div className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                    <TrendingUp size={24} />
                                </div>
                                <div>
                                    <small className="text-uppercase text-muted fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Sponsored Campaign</small>
                                    <h6 className="mb-0 fw-bold">{pin.sponsorName || 'Brand Partner'}</h6>
                                </div>
                            </div>
                            <Button variant="light" className="rounded-circle p-2 d-none d-md-block" onClick={onHide}>
                                <X size={24} />
                            </Button>
                        </div>

                        {/* Scrollable Body */}
                        <div className="flex-grow-1 overflow-auto p-4">
                            <h2 className="fw-bold mb-3 display-6">{pin.title}</h2>
                            <p className="text-secondary lead mb-4" style={{ fontSize: '1.1rem' }}>{pin.description}</p>

                            <div className="d-flex gap-2 mb-4">
                                <Badge bg="light" text="dark" className="border px-3 py-2 rounded-pill fw-normal">
                                    Campaign ID: {pin.campaignId}
                                </Badge>
                                <Badge bg="light" text="dark" className="border px-3 py-2 rounded-pill fw-normal">
                                    Public
                                </Badge>
                            </div>

                            <div className="card bg-light border-0 rounded-4 p-4 mb-4">
                                <h6 className="fw-bold mb-3 text-muted text-uppercase small">Performance Insights</h6>
                                <div className="row g-3">
                                    <div className="col-6">
                                        <div className="bg-white p-3 rounded-3 shadow-sm h-100">
                                            <div className="d-flex align-items-center gap-2 mb-1 text-danger">
                                                <Heart size={18} />
                                                <span className="fw-bold">{pin.savesCount}</span>
                                            </div>
                                            <small className="text-muted">Total Saves</small>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="bg-white p-3 rounded-3 shadow-sm h-100">
                                            <div className="d-flex align-items-center gap-2 mb-1 text-primary">
                                                <MessageCircle size={18} />
                                                <span className="fw-bold">{pin.commentsCount}</span>
                                            </div>
                                            <small className="text-muted">Comments</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-top bg-light">
                            {pin.promotionLink && (
                                <Button
                                    variant="dark"
                                    size="lg"
                                    className="w-100 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2 mb-3"
                                    href={pin.promotionLink}
                                    target="_blank"
                                >
                                    Visit Website <ExternalLink size={20} />
                                </Button>
                            )}
                            <div className="d-flex justify-content-center gap-3">
                                {!isOwner && (
                                    <Button
                                        variant={isFollowing ? "outline-dark" : "danger"}
                                        className="rounded-pill px-4"
                                        onClick={() => onFollow(pin.userId)}
                                    >
                                        {isFollowing ? 'Following' : 'Follow Sponsor'}
                                    </Button>
                                )}
                                <Button variant="outline-secondary" className="rounded-pill px-4">
                                    <Share2 size={18} className="me-2" /> Share
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default SponsoredPinDetailModal;
