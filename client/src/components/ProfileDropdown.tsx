import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ProfileDropdownProps {
  onClose: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(`/profile/${user?.id}`);
    onClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose();
  };

  return (
    <Card
      className="border shadow-lg"
      style={{
        width: '280px',
        borderRadius: '16px',
        border: '1px solid #e1e1e1',
      }}
    >
      <Card.Body className="p-0">
        {/* User Info Section */}
        <div className="p-3 border-bottom">
          <p className="text-muted mb-1" style={{ fontSize: '14px' }}>
            Signed in as
          </p>
          <p className="mb-0" style={{ fontSize: '16px', fontWeight: '500' }}>
            {user?.email}
          </p>
        </div>

        {/* View Profile Button */}
        <Button
          variant="link"
          className="w-100 text-start text-dark text-decoration-none py-3 px-3"
          onClick={handleViewProfile}
          style={{
            borderRadius: '0',
            fontSize: '16px',
          }}
        >
          View Profile
        </Button>

        {/* Log Out Button */}
        <Button
          variant="link"
          className="w-100 text-start text-decoration-none py-3 px-3"
          onClick={handleLogout}
          style={{
            borderRadius: '0',
            fontSize: '16px',
            color: '#e60023',
          }}
        >
          <LogOut size={16} className="me-2" />
          Log Out
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProfileDropdown;
