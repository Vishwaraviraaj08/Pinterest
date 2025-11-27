import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell } from 'lucide-react';
import { Form, Image, ListGroup } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { contentService } from '../services/contentService';
import { PinResponse } from '../types';
import ProfileDropdown from './ProfileDropdown';

const TopNavbar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState<PinResponse[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearchSuggestions(false);
    }
  };

  const handleSearchChange = async (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      try {
        const results = await contentService.searchPins(value);
        setSearchResults(results.slice(0, 5));
        setShowSearchSuggestions(true);
      } catch (error) {
        console.error('Failed to search pins:', error);
      }
    } else {
      setShowSearchSuggestions(false);
    }
  };

  const handleSelectPin = (pinId: string) => {
    setShowSearchSuggestions(false);
    setSearchQuery('');
    navigate(`/pin/${pinId}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchSuggestions(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: '70px',
        right: 0,
        height: '64px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #e1e1e1',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        zIndex: 1000,
      }}
    >
      {/* Search Bar - Centered and takes most space */}
      <div style={{ flex: 1, maxWidth: '800px', margin: '0 auto', position: 'relative' }} ref={searchRef}>
        <Form onSubmit={handleSearch}>
          <div className="position-relative">
            <Search
              className="position-absolute"
              style={{ left: '16px', top: '12px', color: '#5f5f5f' }}
              size={20}
            />
            <Form.Control
              type="text"
              placeholder="Search for ideas"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              style={{
                borderRadius: '24px',
                backgroundColor: '#efefef',
                border: 'none',
                padding: '12px 16px 12px 48px',
                fontSize: '16px',
              }}
            />
          </div>
        </Form>

        {/* Search Suggestions */}
        {showSearchSuggestions && searchResults.length > 0 && (
          <div
            className="position-absolute bg-white border rounded shadow-lg"
            style={{
              top: '50px',
              left: '0',
              right: '0',
              zIndex: 1050,
              maxHeight: '400px',
              overflowY: 'auto',
            }}
          >
            <ListGroup variant="flush">
              {searchResults.map((pin) => (
                <ListGroup.Item
                  key={pin.id}
                  action
                  onClick={() => handleSelectPin(pin.id.toString())}
                  className="d-flex gap-3 align-items-center cursor-pointer"
                >
                  <img
                    src={pin.imageUrl}
                    alt={pin.title}
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: '500' }}>{pin.title}</div>
                    <small className="text-muted">{pin.description?.substring(0, 50)}...</small>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}
      </div>

      {/* Notifications */}
      <div
        className="me-3 cursor-pointer p-2 rounded-circle hover-bg-light"
        onClick={() => navigate('/invitations')}
        title="Notifications"
      >
        <Bell size={24} color="#5f5f5f" />
      </div>

      {/* Profile Picture */}
      <div className="position-relative" ref={profileRef}>
        <div
          onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          style={{ cursor: 'pointer' }}
        >
          <Image
            src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
            roundedCircle
            width={40}
            height={40}
            style={{ objectFit: 'cover' }}
          />
        </div>

        {showProfileDropdown && (
          <div
            className="position-absolute"
            style={{
              top: '50px',
              right: '0',
              zIndex: 1050,
            }}
          >
            <ProfileDropdown onClose={() => setShowProfileDropdown(false)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TopNavbar;
