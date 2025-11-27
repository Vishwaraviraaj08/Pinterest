import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, ListGroup, Image, Spinner, InputGroup } from 'react-bootstrap';
import { Search, UserPlus, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { collaborationService } from '../services/collaborationService';
import { authService } from '../services/authService';
import { UserResponse, ConnectionResponse } from '../types';

interface InviteCollaboratorModalProps {
    show: boolean;
    onHide: () => void;
    boardId: number;
}

interface EnrichedUser extends UserResponse {
    isInvited?: boolean;
}

const InviteCollaboratorModal: React.FC<InviteCollaboratorModalProps> = ({ show, onHide, boardId }) => {
    const { user: currentUser } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [following, setFollowing] = useState<EnrichedUser[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<EnrichedUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [invitingIds, setInvitingIds] = useState<Set<number>>(new Set());

    // Fetch users I am following to invite them
    useEffect(() => {
        const fetchFollowing = async () => {
            if (!currentUser?.id || !show) return;

            setIsLoading(true);
            try {
                const connections = await collaborationService.getFollowing(currentUser.id);

                // Enrich with user details
                const users = await Promise.all(
                    connections.map(async (conn) => {
                        try {
                            return await authService.getProfile(conn.followingId);
                        } catch (e) {
                            return null;
                        }
                    })
                );

                const validUsers = users.filter((u): u is UserResponse => u !== null);
                setFollowing(validUsers);
                setFilteredUsers(validUsers);
            } catch (error) {
                console.error('Failed to fetch following list', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFollowing();
    }, [currentUser?.id, show]);

    // Filter users based on search
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredUsers(following);
            return;
        }

        const lowerQuery = searchQuery.toLowerCase();
        const filtered = following.filter(user =>
            user.username.toLowerCase().includes(lowerQuery) ||
            user.firstName.toLowerCase().includes(lowerQuery) ||
            user.lastName.toLowerCase().includes(lowerQuery)
        );
        setFilteredUsers(filtered);
    }, [searchQuery, following]);

    const handleInvite = async (userId: number) => {
        try {
            setInvitingIds(prev => new Set(prev).add(userId));

            await collaborationService.createInvitation({
                inviteeId: userId,
                boardId: boardId,
                invitationType: 'BOARD_COLLABORATION'
            });

            // Mark as invited locally
            setFollowing(prev => prev.map(u => u.id === userId ? { ...u, isInvited: true } : u));

        } catch (error) {
            console.error('Failed to invite user', error);
            alert('Failed to send invitation.');
        } finally {
            setInvitingIds(prev => {
                const next = new Set(prev);
                next.delete(userId);
                return next;
            });
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title className="fw-bold">Invite Collaborators</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <InputGroup>
                        <InputGroup.Text className="bg-light border-0 rounded-pill-start ps-3">
                            <Search size={18} className="text-muted" />
                        </InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Search by name or email"
                            className="bg-light border-0 rounded-pill-end"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </InputGroup>
                </div>

                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <h6 className="text-muted mb-3 small fw-bold">YOUR CONNECTIONS</h6>

                    {isLoading ? (
                        <div className="text-center py-3">
                            <Spinner animation="border" size="sm" variant="danger" />
                        </div>
                    ) : filteredUsers.length > 0 ? (
                        <ListGroup variant="flush">
                            {filteredUsers.map(user => (
                                <ListGroup.Item
                                    key={user.id}
                                    className="d-flex align-items-center justify-content-between border-0 px-0 py-2"
                                >
                                    <div className="d-flex align-items-center">
                                        <Image
                                            src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                                            roundedCircle
                                            width={40}
                                            height={40}
                                            className="me-3"
                                            style={{ objectFit: 'cover' }}
                                        />
                                        <div>
                                            <div className="fw-bold">{user.firstName} {user.lastName}</div>
                                            <small className="text-muted">@{user.username}</small>
                                        </div>
                                    </div>

                                    <Button
                                        variant={user.isInvited ? "light" : "danger"}
                                        size="sm"
                                        className="rounded-pill fw-bold"
                                        disabled={user.isInvited || invitingIds.has(user.id)}
                                        onClick={() => handleInvite(user.id)}
                                    >
                                        {invitingIds.has(user.id) ? (
                                            <Spinner animation="border" size="sm" />
                                        ) : user.isInvited ? (
                                            'Invited'
                                        ) : (
                                            'Invite'
                                        )}
                                    </Button>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    ) : (
                        <div className="text-center text-muted py-3">
                            No connections found.
                        </div>
                    )}
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default InviteCollaboratorModal;
