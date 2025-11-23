import React, { useState } from 'react';
import { Button, Dropdown, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Bookmark, MoreHorizontal, ExternalLink } from 'lucide-react';
import { Pin } from '../types';
import SaveToBoardModal from './SaveToBoardModal';
import PinDetailModal from './PinDetailModal';

interface PinCardProps {
  pin: Pin;
}

const PinCard: React.FC<PinCardProps> = ({ pin }) => {
  const navigate = useNavigate();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handlePinClick = () => {
    setShowDetailModal(true);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSaveModal(true);
  };

  return (
    <>
      <div className="masonry-item">
        <div className="pin-card" onClick={handlePinClick}>
          {pin.isSponsored && (
            <Badge
              bg="dark"
              className="position-absolute"
              style={{ top: '8px', left: '8px', zIndex: 10 }}
            >
              Sponsored
            </Badge>
          )}
          
          {/* Top Actions */}
          <div className="pin-top-actions">
            <Button
              variant="danger"
              size="sm"
              className="rounded-pill"
              onClick={handleSave}
              style={{ backgroundColor: '#e60023', borderColor: '#e60023', padding: '8px 16px' }}
            >
              Save
            </Button>
            <Dropdown onClick={(e) => e.stopPropagation()}>
              <Dropdown.Toggle
                variant="light"
                size="sm"
                className="rounded-circle p-2"
                style={{ width: '36px', height: '36px' }}
              >
                <MoreHorizontal size={16} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href={pin.link} target="_blank">
                  <ExternalLink size={16} className="me-2" />
                  Visit site
                </Dropdown.Item>
                <Dropdown.Item>Download image</Dropdown.Item>
                <Dropdown.Item>Hide Pin</Dropdown.Item>
                <Dropdown.Item>Report</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <img src={pin.imageUrl} alt={pin.title} loading="lazy" />
          
          {/* Title Overlay at Bottom */}
          <div className="pin-title-overlay">
            <p className="mb-0" style={{ fontSize: '14px', fontWeight: '600' }}>
              {pin.title}
            </p>
          </div>
        </div>
      </div>

      <SaveToBoardModal
        show={showSaveModal}
        onHide={() => setShowSaveModal(false)}
        pin={pin}
      />

      <PinDetailModal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        pin={pin}
      />
    </>
  );
};

export default PinCard;