import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, LayoutGrid, Briefcase, Users, Bell, Plus, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const VerticalNavbar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsExpanded(false);
  };

  const handleMenuClick = () => {
    setIsExpanded(false);
  };

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: LayoutGrid, label: 'Boards', path: '/boards' },
    { icon: Briefcase, label: 'Business', path: '/business-profiles' },
    { icon: Users, label: 'Connections', path: '/connections' },
    { icon: Bell, label: 'Notifications', path: '/invitations', badge: 2 },
    { icon: Plus, label: 'Create', path: '/create-pin' },
  ];

  return (
    <div
      className="vertical-navbar"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        width: isExpanded ? '240px' : '70px',
        backgroundColor: '#fff',
        borderRight: '1px solid #e1e1e1',
        transition: 'width 0.3s ease',
        zIndex: isExpanded ? 1100 : 1000,
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '20px',
        boxShadow: isExpanded ? '4px 0 12px rgba(0, 0, 0, 0.1)' : 'none',
      }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Logo */}
      <div
        style={{
          padding: '0 20px',
          marginBottom: '30px',
          fontSize: '24px',
          fontWeight: '700',
          color: '#e60023',
        }}
      >
        {isExpanded ? 'Pinterest' : 'P'}
      </div>

      {/* Menu Items */}
      <div style={{ flex: 1 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleMenuClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 20px',
                textDecoration: 'none',
                color: isActive ? '#000' : '#4a5565',
                backgroundColor: isActive ? '#f0f0f0' : 'transparent',
                transition: 'all 0.2s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = '#f9f9f9';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <div style={{ position: 'relative', width: '24px', height: '24px' }}>
                <Icon size={24} />
                {item.badge && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-5px',
                      right: '-5px',
                      backgroundColor: '#e60023',
                      color: '#fff',
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      fontSize: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '600',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              {isExpanded && (
                <span
                  style={{
                    marginLeft: '16px',
                    fontSize: '16px',
                    fontWeight: isActive ? '600' : '400',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Logout at Bottom */}
      <div
        onClick={handleLogout}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 20px',
          cursor: 'pointer',
          color: '#e60023',
          transition: 'all 0.2s ease',
          borderTop: '1px solid #e1e1e1',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#fff0f0';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <LogOut size={24} />
        {isExpanded && (
          <span
            style={{
              marginLeft: '16px',
              fontSize: '16px',
              fontWeight: '600',
              whiteSpace: 'nowrap',
            }}
          >
            Log Out
          </span>
        )}
      </div>
    </div>
  );
};

export default VerticalNavbar;