import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Image, Spinner, Alert, Badge } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { collaborationService } from '../services/collaborationService';
import { authService } from '../services/authService';
import { InvitationResponse, UserResponse } from '../types';
import { Check, X, UserPlus, Layout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EnrichedInvitation extends InvitationResponse {
  inviter?: UserResponse;
}

const InvitationsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState<EnrichedInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvitations = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      try {
        const data = await collaborationService.getInvitations(user.id);

        // Filter only PENDING invitations
        const pendingInvitations = data.filter(inv => inv.status === 'PENDING');

        // Enrich with inviter details
        const enriched = await Promise.all(
          pendingInvitations.map(async (inv) => {
            try {
              const inviter = await authService.getProfile(inv.inviterId);
              return { ...inv, inviter };
            } catch (e) {
              console.error(`Failed to fetch inviter ${inv.inviterId}`, e);
              return inv;
            }
          })
        );
        setInvitations(enriched);
      } catch (err) {
        console.error('Failed to fetch invitations', err);
        setError('Failed to load invitations.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvitations();
  }, [user?.id]);

  const handleRespond = async (invitationId: number, response: 'ACCEPTED' | 'DECLINED') => {
    try {
      if (!user?.id) return;
      await collaborationService.respondToInvitation(invitationId, response);

      // Remove from list
      setInvitations(prev => prev.filter(inv => inv.id !== invitationId));

      // Optional: Show success toast/alert
    } catch (err) {
      console.error('Failed to respond to invitation', err);
      alert('Failed to process invitation response.');
    }
  };

  if (isLoading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="danger" />
      </Container>
    );
  }

  return (
    <Container className="py-4" style={{ maxWidth: '800px' }}>
      <h4 className="mb-4 fw-bold">Inbox</h4>

      {error && <Alert variant="danger">{error}</Alert>}

      {invitations.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <div className="mb-3">
            <Layout size={48} strokeWidth={1} />
          </div>
          <h5>No pending invitations</h5>
          <p>When people invite you to collaborate or connect, you'll see them here.</p>
        </div>
      ) : (
        <Row>
          <Col>
            {invitations.map((inv) => (
              <Card key={inv.id} className="mb-3 border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <Image
                      src={inv.inviter?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${inv.inviter?.username || 'user'}`}
                      roundedCircle
                      width={50}
                      height={50}
                      className="me-3 cursor-pointer"
                      style={{ objectFit: 'cover' }}
                      onClick={() => inv.inviter && navigate(`/profile/${inv.inviter.id}`)}
                    />
                    <div className="flex-grow-1">
                      <h6 className="mb-1">
                        <span
                          className="fw-bold cursor-pointer"
                          onClick={() => inv.inviter && navigate(`/profile/${inv.inviter.id}`)}
                        >
                          {inv.inviter?.firstName} {inv.inviter?.lastName}
                        </span>
                        {' '}
                        <span className="fw-normal text-muted">
                          invited you to
                          {inv.invitationType === 'BOARD_COLLABORATION' ? ' collaborate on a board' : ' connect'}
                        </span>
                      </h6>
                      <div className="d-flex align-items-center gap-2">
                        <Badge bg="light" text="dark" className="fw-normal border">
                          {inv.invitationType === 'BOARD_COLLABORATION' ? <Layout size={12} className="me-1" /> : <UserPlus size={12} className="me-1" />}
                          {inv.invitationType === 'BOARD_COLLABORATION' ? 'Board Collaboration' : 'Connection'}
                        </Badge>
                        <small className="text-muted">
                          {new Date(inv.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <Button
                        variant="light"
                        className="rounded-pill px-3 fw-bold"
                        onClick={() => handleRespond(inv.id, 'DECLINED')}
                      >
                        Decline
                      </Button>
                      <Button
                        variant="danger"
                        className="rounded-pill px-3 fw-bold"
                        onClick={() => handleRespond(inv.id, 'ACCEPTED')}
                      >
                        Accept
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default InvitationsPage;