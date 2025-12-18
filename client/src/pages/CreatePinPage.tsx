import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Badge, Modal, Spinner, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { Upload, Eye, Save, X, Plus } from 'lucide-react';
import { usePins } from '../contexts/PinContext';
import { useBoards } from '../contexts/BoardContext';
import { useAuth } from '../contexts/AuthContext';
import { PinRequest, PinResponse } from '../types';
import CreateBoardModal from '../components/CreateBoardModal';

const CreatePinPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { createPin, updatePin, isLoading: isPinLoading } = usePins();
  const { boards, fetchUserBoards, isLoading: isBoardsLoading } = useBoards();
  const { user } = useAuth();

  const editPin = location.state?.editPin as PinResponse | undefined;

  const [formData, setFormData] = useState({
    title: editPin?.title || '',
    description: editPin?.description || '',
    link: editPin?.link || '',
    boardId: editPin?.boardId?.toString() || '',
    keywords: editPin?.keywords || [] as string[],
    isPublic: editPin?.isPublic ?? true,
    imageUrl: editPin?.imageUrl || '',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(editPin?.imageUrl || null);
  const [keywordInput, setKeywordInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showDraftConfirm, setShowDraftConfirm] = useState(false);
  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchUserBoards(user.id);
    }
  }, [user?.id, fetchUserBoards]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, imageUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddKeyword = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && keywordInput.trim()) {
      e.preventDefault();
      if (!formData.keywords.includes(keywordInput.trim())) {
        setFormData({
          ...formData,
          keywords: [...formData.keywords, keywordInput.trim()],
        });
      }
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter(k => k !== keyword),
    });
  };

  const handleSaveAsDraft = async () => {
    try {
      const pinData: PinRequest = {
        title: formData.title,
        description: formData.description,
        imageUrl: formData.imageUrl,
        link: formData.link,
        boardId: formData.boardId ? parseInt(formData.boardId) : undefined,
        isPublic: formData.isPublic,
        isDraft: true,
        isSponsored: false,
        keywords: formData.keywords,
      };

      if (editPin) {
        await updatePin(editPin.id, pinData);
      } else {
        await createPin(pinData);
      }
      alert('Pin saved as draft!');
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to save draft');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.imageUrl) {
      setError('Please upload an image');
      return;
    }

    try {
      const pinData: PinRequest = {
        title: formData.title,
        description: formData.description,
        imageUrl: formData.imageUrl,
        link: formData.link,
        boardId: formData.boardId ? parseInt(formData.boardId) : undefined,
        isPublic: formData.isPublic,
        isDraft: false,
        isSponsored: false,
        keywords: formData.keywords,
      };

      if (editPin) {
        await updatePin(editPin.id, pinData);
        alert('Pin updated successfully!');
      } else {
        await createPin(pinData);
        alert('Pin created successfully!');
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to create pin');
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleBoardCreated = () => {
    if (user?.id) {
      fetchUserBoards(user.id);
    }
    setShowCreateBoardModal(false);
  };

  if (isBoardsLoading && !boards.length) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="danger" />
      </div>
    );
  }

  return (
    <>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>{editPin ? 'Edit Pin' : 'Create Pin'}</h2>
              <div className="d-flex gap-2">
                <Button
                  variant="outline-secondary"
                  className="rounded-pill"
                  onClick={() => setShowDraftConfirm(true)}
                >
                  <Save size={16} className="me-2" />
                  Save as Draft
                </Button>
                <Button
                  variant="light"
                  className="rounded-pill"
                  onClick={handlePreview}
                  disabled={!imagePreview || !formData.title}
                >
                  <Eye size={16} className="me-2" />
                  Preview
                </Button>
              </div>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={5} className="mb-4">
                  <Card className="p-4">
                    <div
                      className="d-flex flex-column align-items-center justify-content-center"
                      style={{
                        minHeight: '400px',
                        border: '2px dashed #ccc',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                          }}
                        />
                      ) : (
                        <>
                          <Upload size={48} className="text-muted mb-3" />
                          <p className="text-muted mb-0">Click to upload image</p>
                          <small className="text-muted">
                            Recommendation: Use high-quality .jpg files
                          </small>
                        </>
                      )}
                      <Form.Control
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                    </div>
                  </Card>
                </Col>

                <Col md={7}>
                  <Form.Group className="mb-3">
                    <Form.Label>Title *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Add your title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      placeholder="Tell everyone what your Pin is about"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Keywords / Tags</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Add keywords (press Enter to add)"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyDown={handleAddKeyword}
                    />
                    <div className="mt-2">
                      {formData.keywords.map((keyword) => (
                        <Badge
                          key={keyword}
                          bg="secondary"
                          className="me-2 mb-2"
                          style={{ fontSize: '14px', cursor: 'pointer' }}
                        >
                          {keyword}
                          <X
                            size={14}
                            className="ms-1"
                            onClick={() => handleRemoveKeyword(keyword)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Source URL (optional)</Form.Label>
                    <Form.Control
                      type="url"
                      placeholder="Add a destination link or source attribution"
                      value={formData.link}
                      onChange={(e) =>
                        setFormData({ ...formData, link: e.target.value })
                      }
                    />
                    <Form.Text className="text-muted">
                      Give credit to the original content creator
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Board</Form.Label>
                    <div className="d-flex gap-2">
                      <Form.Select
                        value={formData.boardId}
                        onChange={(e) =>
                          setFormData({ ...formData, boardId: e.target.value })
                        }
                      >
                        <option value="">Select a board (optional)</option>
                        {boards.map((board) => (
                          <option key={board.id} value={board.id}>
                            {board.name}
                          </option>
                        ))}
                      </Form.Select>
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowCreateBoardModal(true)}
                        title="Create new board"
                      >
                        <Plus size={20} />
                      </Button>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Visibility</Form.Label>
                    <div>
                      <Form.Check
                        type="radio"
                        id="public"
                        label="Public - Anyone can see this Pin"
                        checked={formData.isPublic}
                        onChange={() => setFormData({ ...formData, isPublic: true })}
                      />
                      <Form.Check
                        type="radio"
                        id="private"
                        label="Private - Only you can see this Pin"
                        checked={!formData.isPublic}
                        onChange={() => setFormData({ ...formData, isPublic: false })}
                      />
                    </div>
                  </Form.Group>

                  <div className="d-flex gap-2">
                    <Button
                      variant="secondary"
                      className="rounded-pill px-4"
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="danger"
                      className="rounded-pill px-4"
                      disabled={isPinLoading}
                    >
                      {isPinLoading ? <Spinner animation="border" size="sm" /> : (editPin ? 'Update' : 'Publish')}
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>

      { }
      <Modal show={showPreview} onHide={() => setShowPreview(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Pin Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: '100%', borderRadius: '16px' }}
                />
              )}
            </Col>
            <Col md={6}>
              <h4>{formData.title}</h4>
              <p className="text-muted">{formData.description}</p>
              {formData.keywords.length > 0 && (
                <div className="mb-3">
                  {formData.keywords.map((keyword) => (
                    <Badge key={keyword} bg="secondary" className="me-2">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              )}
              {formData.link && (
                <p>
                  <strong>Source:</strong>{' '}
                  <a href={formData.link} target="_blank" rel="noopener noreferrer">
                    {formData.link}
                  </a>
                </p>
              )}
              <Badge bg={formData.isPublic ? 'success' : 'warning'}>
                {formData.isPublic ? 'Public' : 'Private'}
              </Badge>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreview(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      { }
      <Modal show={showDraftConfirm} onHide={() => setShowDraftConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Save as Draft</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Save this Pin as a draft? You can return to it later to finish editing.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDraftConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleSaveAsDraft} disabled={isPinLoading}>
            {isPinLoading ? <Spinner animation="border" size="sm" /> : 'Save Draft'}
          </Button>
        </Modal.Footer>
      </Modal>

      <CreateBoardModal
        show={showCreateBoardModal}
        onHide={() => setShowCreateBoardModal(false)}
        onBoardCreated={handleBoardCreated}
      />
    </>
  );
};

export default CreatePinPage;