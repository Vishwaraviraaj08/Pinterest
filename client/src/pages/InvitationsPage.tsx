import React, { useState } from 'react';
import { Container, Card, Image, Button, Badge } from 'react-bootstrap';
import { Users, UserPlus, CheckCircle, XCircle } from 'lucide-react';

interface Invitation {
  id: string;
  type: 'board_collaboration' | 'connection';
  from: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
  boardName?: string;
  message?: string;
  timestamp: string;
}

interface PastInvitation {
  id: string;
  from: {
    name: string;
    avatar: string;
  };
  type: string;
  timestamp: string;
  status: 'accepted' | 'declined';
}

const mockInvitations: Invitation[] = [
  {
    id: '1',
    type: 'board_collaboration',
    from: {
      id: '2',
      username: 'mariag',
      firstName: 'Maria',
      lastName: 'Garcia',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    },
    boardName: 'Recipe Collection',
    message: 'Would love to have you collaborate on our recipe board!',
    timestamp: '366d ago',
  },
  {
    id: '2',
    type: 'connection',
    from: {
      id: '3',
      username: 'michaelb',
      firstName: 'Michael',
      lastName: 'Brown',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    },
    message: 'Love your design work! Let\'s connect.',
    timestamp: '365d ago',
  },
];

const mockPastInvitations: PastInvitation[] = [
  {
    id: 'p1',
    from: {
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    },
    type: 'Board collaboration',
    timestamp: '367d ago',
    status: 'accepted',
  },
  {
    id: 'p2',
    from: {
      name: 'Lisa Thompson',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    },
    type: 'Connection request',
    timestamp: '368d ago',
    status: 'declined',
  },
];

const InvitationsPage: React.FC = () => {
  const [invitations, setInvitations] = useState(mockInvitations);
  const [pastInvitations] = useState(mockPastInvitations);

  const handleAccept = (invitationId: string) => {
    const invitation = invitations.find(inv => inv.id === invitationId);
    if (invitation) {
      if (invitation.type === 'board_collaboration') {
        console.log(`Accepting board collaboration for ${invitation.boardName}`);
        alert(`You are now a collaborator on "${invitation.boardName}"!`);
      } else {
        console.log(`Accepting connection from ${invitation.from.username}`);
        alert(`You are now connected with ${invitation.from.firstName}!`);
      }
      setInvitations(invitations.filter(inv => inv.id !== invitationId));
    }
  };

  const handleDecline = (invitationId: string) => {
    console.log(`Declining invitation ${invitationId}`);
    setInvitations(invitations.filter(inv => inv.id !== invitationId));
  };

  return (
    <Container className="py-4" style={{ maxWidth: '900px', marginTop: '80px' }}>
      {/* Header */}
      <div className="mb-4">
        <h4 className="mb-0">Invitations & Notifications</h4>
      </div>

      {/* Pending Invitations Section */}
      <div className="mb-5">
        <h5 className="mb-3">Pending Invitations</h5>

        {invitations.length > 0 ? (
          <div className="d-flex flex-column gap-3">
            {invitations.map((invitation) => (
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
                          backgroundImage: `url(${invitation.from.avatar})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        {invitation.type === 'board_collaboration' ? (
                          <Users size={20} style={{ color: '#155DFC' }} />
                        ) : (
                          <UserPlus size={20} style={{ color: '#155DFC' }} />
                        )}
                        <p className="mb-0" style={{ fontSize: '16px' }}>
                          <strong>{invitation.from.firstName} {invitation.from.lastName}</strong>
                          {invitation.type === 'board_collaboration' ? (
                            <>
                              {' invited you to collaborate on '}
                              <strong>"{invitation.boardName}"</strong>
                            </>
                          ) : (
                            ' wants to connect with you'
                          )}
                        </p>
                      </div>

                      {invitation.message && (
                        <div
                          className="mb-3 p-3"
                          style={{
                            backgroundColor: '#f9fafb',
                            borderRadius: '10px',
                            fontSize: '14px',
                            color: '#364153',
                          }}
                        >
                          "{invitation.message}"
                        </div>
                      )}

                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">{invitation.timestamp}</small>
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
                          backgroundImage: `url(${invitation.from.avatar})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                    </div>
                    <div className="flex-grow-1">
                      <p className="mb-0" style={{ fontSize: '14px' }}>
                        <strong>{invitation.from.name}</strong>
                        <span className="text-muted ms-2">{invitation.type}</span>
                      </p>
                      <small className="text-muted">{invitation.timestamp}</small>
                    </div>
                    <Badge
                      bg={invitation.status === 'accepted' ? 'success' : 'secondary'}
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