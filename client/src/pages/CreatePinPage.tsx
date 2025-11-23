import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Badge, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Upload, Eye, Save, X } from 'lucide-react';
import { mockBoards } from '../utils/mockData';

const CreatePinPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    boardId: '',
    keywords: [] as string[],
    isPublic: true,
    imageUrl: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [keywordInput, setKeywordInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showDraftConfirm, setShowDraftConfirm] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
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

  const handleSaveAsDraft = () => {
    console.log('Saving pin as draft:', formData);
    localStorage.setItem('pinDraft', JSON.stringify({ ...formData, imagePreview }));
    alert('Pin saved as draft!');
    navigate('/');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock create pin - In production, this would call the Content Microservice
    console.log('Creating pin:', formData);
    localStorage.removeItem('pinDraft'); // Clear any draft
    alert('Pin published successfully!');
    navigate('/');
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  // Load draft on mount
  React.useEffect(() => {
    const draft = localStorage.getItem('pinDraft');
    if (draft) {
      const parsedDraft = JSON.parse(draft);
      setFormData(parsedDraft);
      setImagePreview(parsedDraft.imagePreview);
    }
  }, []);

  return (
    <>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Create Pin</h2>
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
                        accept="image/*,video/*"
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
                    <Form.Label>Board *</Form.Label>
                    <Form.Select
                      value={formData.boardId}
                      onChange={(e) =>
                        setFormData({ ...formData, boardId: e.target.value })
                      }
                      required
                    >
                      <option value="">Select a board</option>
                      {mockBoards.map((board) => (
                        <option key={board.id} value={board.id}>
                          {board.name}
                        </option>
                      ))}
                    </Form.Select>
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
                    >
                      Publish
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>

      {/* Preview Modal */}
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

      {/* Save Draft Confirmation */}
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
          <Button variant="danger" onClick={handleSaveAsDraft}>
            Save Draft
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CreatePinPage;