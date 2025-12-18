import React, { useState, useEffect } from 'react';
import { Modal, Button, Image, Form, Dropdown } from 'react-bootstrap';
import { X, Bookmark, MoreHorizontal, ExternalLink, Download } from 'lucide-react';
import { Pin, Board, UserResponse } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { contentService } from '../services/contentService';
import { collaborationService } from '../services/collaborationService';
import { authService } from '../services/authService';
import SaveToBoardModal from './SaveToBoardModal';
import ReportModal from './ReportModal';

interface PinDetailModalProps {
  show: boolean;
  onHide: () => void;
  pin: Pin;
}

const PinDetailModal: React.FC<PinDetailModalProps> = ({ show, onHide, pin }) => {
  const { user } = useAuth();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [author, setAuthor] = useState<UserResponse | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [userBoards, setUserBoards] = useState<Board[]>([]);

  useEffect(() => {
    if (show && pin) {
      loadPinDetails();
    }
  }, [show, pin]);

  const loadPinDetails = async () => {
    try {
      
      const fetchedComments = await contentService.getComments(pin.id);
      setComments(fetchedComments);

      
      const authorData = await authService.getProfile(pin.userId);
      setAuthor(authorData);

      
      const followers = await collaborationService.getFollowers(pin.userId);
      setFollowersCount(followers.length);

      
      if (user) {
        const myFollowing = await collaborationService.getFollowing(user.id);
        setIsFollowing(myFollowing.some(c => c.followingId === pin.userId));
      }
    } catch (error) {
      console.error('Failed to load pin details:', error);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim() && user) {
      try {
        const newComment = await contentService.createComment({ text: comment, pinId: pin.id });
        setComments([...comments, { ...newComment, username: user.username, avatar: user.avatar }]);
        setComment('');
      } catch (error) {
        console.error('Failed to add comment:', error);
      }
    }
  };

  const handleFollowToggle = async () => {
    if (!user || !author) return;
    try {
      if (isFollowing) {
        await collaborationService.unfollowUser(author.id);
        setIsFollowing(false);
        setFollowersCount(prev => prev - 1);
      } else {
        await collaborationService.followUser(author.id);
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    }
  };

  const handleSaveClick = async () => {
    if (user) {
      try {
        const boards = await contentService.getUserBoards(user.id);
        setUserBoards(boards);
        setShowSaveModal(true);
      } catch (error) {
        console.error('Failed to fetch boards:', error);
      }
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(pin.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pin-${pin.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const isAuthor = user?.id === pin.userId;

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        size="xl"
        centered
        contentClassName="border-0"
        dialogClassName="modal-pin-detail"
        backdropClassName="modal-backdrop-blur"
      >
        <Modal.Body className="p-0" style={{ borderRadius: '16px', overflow: 'hidden', height: '90vh', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)' }}>
          <div className="row g-0 h-100">
            { }
            <div className="col-md-7 bg-white d-flex align-items-center justify-content-center p-4" style={{ height: '90vh' }}>
              <img
                src={pin.imageUrl}
                alt={pin.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  borderRadius: '8px',
                }}
              />
            </div>

            { }
            <div className="col-md-5 d-flex flex-column bg-white" style={{ height: '90vh', borderLeft: '1px solid #e1e1e1' }}>
              { }
              <div className="d-flex align-items-center justify-content-between p-3 border-bottom" style={{ minHeight: '60px' }}>
                <div className="d-flex gap-2">
                  <Dropdown>
                    <Dropdown.Toggle variant="light" size="sm" className="rounded-circle p-2 no-caret">
                      <MoreHorizontal size={20} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={handleDownload} className="d-flex align-items-center">
                        <Download size={16} className="me-2" />
                        Download image
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>

                <div className="d-flex gap-2">
                  <Button
                    variant="danger"
                    className="rounded-pill d-flex align-items-center gap-2"
                    style={{ backgroundColor: '#e60023', borderColor: '#e60023', padding: '8px 16px' }}
                    onClick={handleSaveClick}
                  >
                    <Bookmark size={16} />
                    Save
                  </Button>

                  <Button
                    variant="light"
                    size="sm"
                    className="rounded-circle p-2"
                    onClick={onHide}
                  >
                    <X size={20} />
                  </Button>
                </div>
              </div>

              { }
              <div className="flex-grow-1 overflow-auto p-4" style={{ maxHeight: 'calc(90vh - 180px)' }}>
                { }
                {pin.link && (
                  <a
                    href={pin.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="d-flex align-items-center gap-2 text-decoration-none text-secondary mb-3"
                    style={{ fontSize: '14px' }}
                  >
                    <ExternalLink size={16} />
                    {new URL(pin.link).hostname}
                  </a>
                )}

                { }
                <h4 className="mb-2">{pin.title}</h4>

                { }
                <p className="text-secondary mb-3">{pin.description}</p>

                { }
                {pin.isSponsored && (
                  <div className="mb-3 p-3 bg-light rounded">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <small className="text-muted d-block">Sponsored by</small>
                        <span className="fw-bold">{pin.sponsorName || 'Unknown Sponsor'}</span>
                        {pin.campaignId && <small className="text-muted d-block">Campaign ID: {pin.campaignId}</small>}
                      </div>
                      {pin.promotionLink && (
                        <Button
                          variant="primary"
                          size="sm"
                          href={pin.promotionLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-pill"
                        >
                          Visit Site
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                { }
                <div className="d-flex gap-4 mb-3" style={{ fontSize: '14px', color: '#4a5565' }}>
                  <span>{pin.savesCount || 0} saves</span>
                  <span>{comments.length} comments</span>
                </div>

                { }
                {author && (
                  <div className="d-flex align-items-center gap-3 py-3 border-top border-bottom mb-4">
                    <Image
                      src={author.avatar || '/default-avatar.svg'}
                      roundedCircle
                      width={48}
                      height={48}
                      style={{ objectFit: 'cover', minWidth: '48px', minHeight: '48px' }}
                    />
                    <div className="flex-grow-1">
                      <div className="fw-semibold">{author.username}</div>
                      <small className="text-secondary">{followersCount} followers</small>
                    </div>
                    {!isAuthor && (
                      <Button
                        variant={isFollowing ? "secondary" : "danger"}
                        size="sm"
                        className="rounded-pill px-3"
                        onClick={handleFollowToggle}
                      >
                        {isFollowing ? 'Unfollow' : 'Follow'}
                      </Button>
                    )}
                  </div>
                )}

                { }
                <div className="mb-4">
                  <h5 className="mb-3">{comments.length} Comments</h5>

                  <div className="mb-3">
                    {comments.map((c) => (
                      <div key={c.id} className="d-flex gap-3 mb-3">
                        <Image
                          src={c.avatar || '/default-avatar.svg'}
                          roundedCircle
                          width={32}
                          height={32}
                          style={{ objectFit: 'cover', minWidth: '32px', minHeight: '32px' }}
                        />
                        <div className="flex-grow-1">
                          <div className="mb-1">
                            <strong style={{ fontSize: '14px' }}>{c.username || 'User'}</strong>
                            <span className="text-secondary ms-2" style={{ fontSize: '14px' }}>
                              · {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Just now'}
                            </span>
                          </div>
                          <p className="mb-0" style={{ fontSize: '14px', color: '#364153' }}>
                            {c.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              { }
              <div className="p-3 border-top bg-white" style={{ minHeight: '80px' }}>
                <Form onSubmit={handleAddComment}>
                  <div className="d-flex gap-2 align-items-center">
                    <Image
                      src={user?.avatar || '/default-avatar.svg'}
                      roundedCircle
                      width={32}
                      height={32}
                      style={{ objectFit: 'cover', minWidth: '32px', minHeight: '32px' }}
                    />
                    <Form.Control
                      type="text"
                      placeholder="Add a comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="rounded-pill"
                      style={{ border: '2px solid #e1e1e1', padding: '8px 16px' }}
                    />
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <SaveToBoardModal
        show={showSaveModal}
        onHide={() => setShowSaveModal(false)}
        pin={pin}
        boards={userBoards}
      />

      <ReportModal
        show={showReportModal}
        onHide={() => setShowReportModal(false)}
        pinId={pin.id}
      />
    </>
  );
};

export default PinDetailModal;