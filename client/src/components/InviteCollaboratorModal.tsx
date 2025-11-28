import React, { useState } from 'react';
import { Modal, Form, Button, ListGroup, Image, Spinner, Alert } from 'react-bootstrap';
import { Search, UserPlus, Check } from 'lucide-react';
import { authService } from '../services/authService';
import { collaborationService } from '../services/collaborationService';
import { UserResponse } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface InviteCollaboratorModalProps {
    show: boolean;
    onHide: () => void;
    boardId: number;
    boardName: string;
}

const InviteCollaboratorModal: React.FC<InviteCollaboratorModalProps> = ({
    show,
    onHide,
    boardId,
    boardName,
}) => {
    const { user: currentUser } = useAuth();
    const [keyword, setKeyword] = useState('');
    const [searchResults, setSearchResults] = useState<UserResponse[]>([]);
    const [suggestedUsers, setSuggestedUsers] = useState<UserResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [invitedUsers, setInvitedUsers] = useState<number[]>([]);
    const [error, setError] = useState<string | null>(null);

    React.useEffect(() => {
        if (show && currentUser?.id) {
            fetchSuggestedUsers();
        }
    }, [show, currentUser?.id]);

    const fetchSuggestedUsers = async () => {
        if (!currentUser?.id) return;
        try {
            const [followers, following] = await Promise.all([
                collaborationService.getFollowers(currentUser.id),
                collaborationService.getFollowing(currentUser.id)
            ]);

            const userIds = new Set([
                ...followers.map(f => f.followerId),
                ...following.map(f => f.followingId)
            ]);

            // Remove current user ID just in case
            userIds.delete(currentUser.id);

            if (userIds.size > 0) {
                const users = await authService.getUsersByIds(Array.from(userIds));
                setSuggestedUsers(users);
            }
        } catch (err) {
            console.error('Failed to fetch suggested users', err);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!keyword.trim()) return;

        setIsLoading(true);
        setError(null);
        try {
            const results = await authService.searchUsers(keyword);
            // Filter out current user
            setSearchResults(results.filter(u => u.id !== currentUser?.id));
        } catch (err) {
            console.error('Failed to search users', err);
            setError('Failed to search users');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInvite = async (userId: number) => {
        if (!currentUser?.id) return;
        try {
            await collaborationService.createInvitation({
                boardId,
                inviterId: currentUser.id,
                inviteeId: userId,
                invitationType: 'BOARD_COLLABORATION'
            });
            setInvitedUsers([...invitedUsers, userId]);
        } catch (err) {
            console.error('Failed to invite user', err);
            alert('Failed to invite user');
        }
    };

    const displayUsers = keyword ? searchResults : suggestedUsers;

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Invite collaborators to {boardName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSearch} className="mb-4">
                    <div className="d-flex gap-2">
                        <div className="position-relative flex-grow-1">
                            <Search size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                            <Form.Control
                                type="text"
                                placeholder="Search by name or email"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className="rounded-pill ps-5"
                            />
                        </div>
                        <Button type="submit" variant="dark" className="rounded-pill" disabled={isLoading}>
                            {isLoading ? <Spinner size="sm" animation="border" /> : 'Search'}
                        </Button>
                    </div>
                </Form>

                {error && <Alert variant="danger">{error}</Alert>}

                {!keyword && suggestedUsers.length > 0 && (
                    <h6 className="text-muted mb-3">Suggested</h6>
                )}
                {keyword && searchResults.length > 0 && (
                    <h6 className="text-muted mb-3">Search Results</h6>
                )}

                <ListGroup variant="flush">
                    {displayUsers.map((user) => (
                        <ListGroup.Item key={user.id} className="d-flex align-items-center justify-content-between border-0 px-0 py-2">
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
                            {invitedUsers.includes(user.id) ? (
                                <Button variant="light" className="rounded-pill" disabled>
                                    <Check size={18} className="me-1 text-success" />
                                    Invited
                                </Button>
                            ) : (
                                <Button variant="danger" className="rounded-pill d-flex align-items-center" onClick={() => handleInvite(user.id)}>
                                    <UserPlus size={18} className="me-1" />
                                    Invite
                                </Button>
                            )}
                        </ListGroup.Item>
                    ))}
                    {displayUsers.length === 0 && !isLoading && (
                        <div className="text-center text-muted py-3">
                            {keyword ? 'No users found' : 'No suggested users'}
                        </div>
                    )}
                </ListGroup>
            </Modal.Body>
        </Modal>
    );
};

export default InviteCollaboratorModal;
