import React from 'react';
import { Modal, Image, Button } from 'react-bootstrap';
import { UserResponse } from '../types';
import { useNavigate } from 'react-router-dom';

interface UserDetailsModalProps {
    show: boolean;
    onHide: () => void;
    user: UserResponse | null;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ show, onHide, user }) => {
    const navigate = useNavigate();

    if (!user) return null;

    const handleViewProfile = () => {
        navigate(`/profile/${user.id}`);
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton className="border-0">
                <Modal.Title className="fw-bold">User Details</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center pb-4">
                <Image
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                    roundedCircle
                    width={120}
                    height={120}
                    className="mb-3 shadow-sm mx-auto d-block"
                    style={{ objectFit: 'cover' }}
                />
                <h4 className="fw-bold mb-1">
                    {user.firstName} {user.lastName}
                </h4>
                <p className="text-muted mb-3">@{user.username}</p>

                {user.bio && (
                    <p className="mb-3 px-4">{user.bio}</p>
                )}

                <div className="d-flex justify-content-center gap-2 mt-4">
                    <Button
                        variant="danger"
                        className="rounded-pill px-4 fw-bold"
                        onClick={handleViewProfile}
                    >
                        View Profile
                    </Button>
                    <Button
                        variant="light"
                        className="rounded-pill px-4 fw-bold"
                        onClick={onHide}
                    >
                        Close
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default UserDetailsModal;
