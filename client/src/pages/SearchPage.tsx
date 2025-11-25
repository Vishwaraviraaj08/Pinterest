import React, { useState, useEffect } from 'react';
import { Container, Form, Nav, Spinner, Alert } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import PinCard from '../components/PinCard';
import BoardCard from '../components/BoardCard';
import { Row, Col } from 'react-bootstrap';
import { usePins } from '../contexts/PinContext';
import { useBoards } from '../contexts/BoardContext';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState('pins');

  const { pins, searchPins, isLoading: isPinsLoading, error: pinsError } = usePins();
  const { boards, searchBoards, isLoading: isBoardsLoading, error: boardsError } = useBoards();

  useEffect(() => {
    if (query) {
      searchPins(query);
      searchBoards(query);
    }
  }, [query, searchPins, searchBoards]);

  const isLoading = isPinsLoading || isBoardsLoading;
  const error = pinsError || boardsError;

  if (isLoading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="danger" />
      </div>
    );
  }

  return (
    <Container>
      <div className="py-4">
        <h2 className="mb-4">Search results for "{query}"</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link
              active={activeTab === 'pins'}
              onClick={() => setActiveTab('pins')}
              className="cursor-pointer"
            >
              Pins ({pins.length})
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              active={activeTab === 'boards'}
              onClick={() => setActiveTab('boards')}
              className="cursor-pointer"
            >
              Boards ({boards.length})
            </Nav.Link>
          </Nav.Item>
        </Nav>

        {activeTab === 'pins' && (
          <>
            {pins.length > 0 ? (
              <div className="masonry-grid">
                {pins.map((pin) => (
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
            {boards.length > 0 ? (
              <Row>
                {boards.map((board) => (
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
