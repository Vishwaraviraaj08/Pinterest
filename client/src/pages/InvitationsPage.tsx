import React, { useState, useEffect } from 'react';
import { Container, Card, Image, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { Users, UserPlus, CheckCircle, XCircle } from 'lucide-react';
import { useInvitations } from '../contexts/InvitationContext';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { InvitationResponse, UserResponse } from '../types';

interface InvitationUI extends InvitationResponse {
  inviter?: UserResponse;
}

const InvitationsPage: React.FC = () => {
  const { user } = useAuth();
  const { invitations, fetchInvitations, respondToInvitation, isLoading: isInvLoading, error: invError } = useInvitations();
  const [enrichedInvitations, setEnrichedInvitations] = useState<InvitationUI[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchInvitations(user.id);
    }
  }, [user?.id, fetchInvitations]);

  useEffect(() => {
    const fetchDetails = async () => {
      if (invitations.length > 0) {
        setIsLoadingDetails(true);
        try {
          const enriched = await Promise.all(
            invitations.map(async (inv) => {
              try {
                const inviter = await authService.getProfile(inv.inviterId);
                return { ...inv, inviter };
              } catch (e) {
                console.error(`Failed to fetch inviter details for ${inv.inviterId}`, e);
                return inv;
              }
            })
          );
          setEnrichedInvitations(enriched);
        } catch (error) {
          console.error('Error fetching invitation details:', error);
        } finally {
          setIsLoadingDetails(false);
        }
      } else {
        setEnrichedInvitations([]);
      }
    };

    fetchDetails();
  }, [invitations]);

  const handleAccept = async (invitationId: number) => {
    try {
      await respondToInvitation(invitationId, 'ACCEPTED');
      alert('Invitation accepted!');
    } catch (error) {
      alert('Failed to accept invitation');
    }
  };

  const handleDecline = async (invitationId: number) => {
    try {
      await respondToInvitation(invitationId, 'DECLINED');
      alert('Invitation declined');
    } catch (error) {
      alert('Failed to decline invitation');
    }
  };

  const pendingInvitations = enrichedInvitations.filter(inv => inv.status === 'PENDING');
  const pastInvitations = enrichedInvitations.filter(inv => inv.status !== 'PENDING');

  const isLoading = isInvLoading || isLoadingDetails;

  if (isLoading && enrichedInvitations.length === 0) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="danger" />
      </div>
    );
  }

  return (
    <Container className="py-4" style={{ maxWidth: '900px', marginTop: '80px' }}>
      {/* Header */}
      <div className="mb-4">
        <h4 className="mb-0">Invitations & Notifications</h4>
      </div>

      {invError && <Alert variant="danger">{invError}</Alert>}

      {/* Pending Invitations Section */}
      <div className="mb-5">
        <h5 className="mb-3">Pending Invitations</h5>

        {pendingInvitations.length > 0 ? (
          <div className="d-flex flex-column gap-3">
            {pendingInvitations.map((invitation) => (
              <Card key={invitation.id} className="border" style={{ borderRadius: '16px', borderColor: '#e1e1e1' }}>
                <Card.Body className="p-4">
                  <div className="d-flex gap-3">
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
                          backgroundImage: `url(${invitation.inviter?.avatar || '/default-avatar.svg'})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        {invitation.invitationType === 'BOARD_COLLABORATION' ? (
                          <Users size={20} style={{ color: '#155DFC' }} />
                        ) : (
                          <UserPlus size={20} style={{ color: '#155DFC' }} />
                        )}
                        <p className="mb-0" style={{ fontSize: '16px' }}>
                          <strong>{invitation.inviter?.firstName} {invitation.inviter?.lastName}</strong>
                          {invitation.invitationType === 'BOARD_COLLABORATION' ? (
                            <>
                              {' invited you to collaborate on a board'}
                            </>
                          ) : (
                            ' wants to connect with you'
                          )}
                        </p>
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">{new Date(invitation.createdAt).toLocaleDateString()}</small>
                        <div className="d-flex gap-2">
                          <Button
                            variant="light"
                            size="sm"
                            className="rounded-pill d-flex align-items-center gap-2"
                            onClick={() => handleDecline(invitation.id)}
                            style={{
                              border: '1px solid #e1e1e1',
                              color: '#364153',
                            }}
                          >
                            <XCircle size={16} />
                            Decline
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            className="rounded-pill d-flex align-items-center gap-2"
                            onClick={() => handleAccept(invitation.id)}
                            style={{
                              backgroundColor: '#155DFC',
                              borderColor: '#155DFC',
                            }}
                          >
                            <CheckCircle size={16} />
                            Accept
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <p className="text-muted">No pending invitations</p>
          </div>
        )}
      </div>

      {/* Past Invitations Section */}
      <div>
        <h5 className="mb-3">Past Invitations</h5>

        {pastInvitations.length > 0 ? (
          <div className="d-flex flex-column gap-3">
            {pastInvitations.map((invitation) => (
              <Card
                key={invitation.id}
                className="border"
                style={{
                  borderRadius: '16px',
                  borderColor: '#e1e1e1',
                  backgroundColor: '#fafafa',
                }}
              >
                <Card.Body className="p-3">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        minWidth: '48px',
                        minHeight: '48px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          backgroundImage: `url(${invitation.inviter?.avatar || '/default-avatar.svg'})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                    </div>
                    <div className="flex-grow-1">
                      <p className="mb-0" style={{ fontSize: '14px' }}>
                        <strong>{invitation.inviter?.username}</strong>
                        <span className="text-muted ms-2">{invitation.invitationType}</span>
                      </p>
                      <small className="text-muted">{new Date(invitation.createdAt).toLocaleDateString()}</small>
                    </div>
                    <Badge
                      bg={invitation.status === 'ACCEPTED' ? 'success' : 'secondary'}
                      className="text-capitalize"
                      style={{
                        padding: '6px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    >
                      {invitation.status}
                    </Badge>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <p className="text-muted">No past invitations</p>
          </div>
        )}
      </div>
    </Container>
  );
};

export default InvitationsPage;