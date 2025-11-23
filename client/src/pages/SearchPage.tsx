import React, { useState, useEffect } from 'react';
import { Container, Form, Nav } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { mockPins, mockBoards } from '../utils/mockData';
import PinCard from '../components/PinCard';
import BoardCard from '../components/BoardCard';
import { Row, Col } from 'react-bootstrap';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState('pins');

  // Mock search - In production, this would call the Search Microservice
  const searchResults = {
    pins: mockPins.filter(
      pin =>
        pin.title.toLowerCase().includes(query.toLowerCase()) ||
        pin.description.toLowerCase().includes(query.toLowerCase())
    ),
    boards: mockBoards.filter(
      board =>
        board.name.toLowerCase().includes(query.toLowerCase()) ||
        board.description.toLowerCase().includes(query.toLowerCase())
    ),
  };

  return (
    <Container>
      <div className="py-4">
        <h2 className="mb-4">Search results for "{query}"</h2>

        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link
              active={activeTab === 'pins'}
              onClick={() => setActiveTab('pins')}
              className="cursor-pointer"
            >
              Pins ({searchResults.pins.length})
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              active={activeTab === 'boards'}
              onClick={() => setActiveTab('boards')}
              className="cursor-pointer"
            >
              Boards ({searchResults.boards.length})
            </Nav.Link>
          </Nav.Item>
        </Nav>

        {activeTab === 'pins' && (
          <>
            {searchResults.pins.length > 0 ? (
              <div className="masonry-grid">
                {searchResults.pins.map((pin) => (
                  <PinCard key={pin.id} pin={pin} />
                ))}
              </div>
            ) : (
              <div className="text-center py-5">
                <h4>No pins found</h4>
                <p className="text-muted">Try searching for something else</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'boards' && (
          <>
            {searchResults.boards.length > 0 ? (
              <Row>
                {searchResults.boards.map((board) => (
                  <Col key={board.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                    <BoardCard board={board} />
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="text-center py-5">
                <h4>No boards found</h4>
                <p className="text-muted">Try searching for something else</p>
              </div>
            )}
          </>
        )}
      </div>
    </Container>
  );
};

export default SearchPage;
