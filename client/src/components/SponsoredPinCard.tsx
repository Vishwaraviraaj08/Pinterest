import React from 'react';
import { Card, Button, Badge, Dropdown } from 'react-bootstrap';
import { Pin } from '../types';
import { ExternalLink, MoreHorizontal, Edit2, Trash2, TrendingUp } from 'lucide-react';

interface SponsoredPinCardProps {
    pin: Pin;
    isOwner: boolean;
    isFollowing: boolean;
    onEdit: (pin: Pin) => void;
    onDelete: (pinId: number) => void;
    onFollow: (userId: number) => void;
    onClick?: (pin: Pin) => void;
}

const SponsoredPinCard: React.FC<SponsoredPinCardProps> = ({
    pin,
    isOwner,
    isFollowing,
    onEdit,
    onDelete,
    onFollow,
    onClick
}) => {
    return (
        <Card
            className="h-100 border-0 shadow-sm overflow-hidden cursor-pointer"
            style={{ borderRadius: '16px' }}
            onClick={() => onClick && onClick(pin)}
        >
            <div className="position-relative">
                <Card.Img
                    variant="top"
                    src={pin.imageUrl}
                    style={{ height: '300px', objectFit: 'cover' }}
                />
                <div
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)' }}
                />
                <Badge
                    bg="warning"
                    text="dark"
                    className="position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill fw-bold"
                    style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}
                >
                    SPONSORED
                </Badge>

                <div className="position-absolute top-0 end-0 m-3" onClick={e => e.stopPropagation()}>
                    {isOwner ? (
                        <Dropdown>
                            <Dropdown.Toggle variant="light" size="sm" className="rounded-circle p-2 no-caret bg-white bg-opacity-75 border-0">
                                <MoreHorizontal size={20} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => onEdit(pin)} className="d-flex align-items-center">
                                    <Edit2 size={16} className="me-2" /> Edit Campaign
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => onDelete(pin.id)} className="text-danger d-flex align-items-center">
                                    <Trash2 size={16} className="me-2" /> Delete
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    ) : (
                        <Button
                            variant={isFollowing ? "dark" : "danger"}
                            size="sm"
                            className="rounded-pill px-3 fw-bold"
                            onClick={() => onFollow(pin.userId)}
                        >
                            {isFollowing ? 'Following' : 'Follow'}
                        </Button>
                    )}
                </div>

                <div className="position-absolute bottom-0 start-0 w-100 p-3 text-white">
                    <h5 className="fw-bold mb-1">{pin.title}</h5>
                    <div className="d-flex align-items-center justify-content-between">
                        <small className="opacity-75">
                            {pin.sponsorName ? `by ${pin.sponsorName}` : 'Unknown Sponsor'}
                        </small>
                        {pin.promotionLink && (
                            <Button
                                variant="light"
                                size="sm"
                                className="rounded-pill px-3 fw-bold d-flex align-items-center"
                                href={pin.promotionLink}
                                target="_blank"
                                onClick={e => e.stopPropagation()}
                            >
                                Visit <ExternalLink size={14} className="ms-1" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            <Card.Body className="bg-light">
                <div className="d-flex justify-content-between align-items-center text-muted small">
                    <div className="d-flex align-items-center">
                        <TrendingUp size={16} className="me-1" />
                        <span>Campaign ID: {pin.campaignId || 'N/A'}</span>
                    </div>
                    <div>
                        {pin.savesCount} saves • {pin.commentsCount} comments
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default SponsoredPinCard;
