import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PinProvider } from './contexts/PinContext';
import { BoardProvider } from './contexts/BoardContext';
import { ConnectionProvider } from './contexts/ConnectionContext';
import { InvitationProvider } from './contexts/InvitationContext';
import VerticalNavbar from './components/VerticalNavbar';
import TopNavbar from './components/TopNavbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import BoardPage from './pages/BoardPage';
import BoardsPage from './pages/BoardsPage';
import PinDetailPage from './pages/PinDetailPage';
import SearchPage from './pages/SearchPage';
import CreatePinPage from './pages/CreatePinPage';
import FollowersPage from './pages/FollowersPage';
import InvitationsPage from './pages/InvitationsPage';
import ConnectionsPage from './pages/ConnectionsPage';
import BusinessProfilesPage from './pages/BusinessProfilesPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/globals.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <>
      <VerticalNavbar />
      <TopNavbar />
      <div style={{ marginLeft: '70px', marginTop: '64px', minHeight: 'calc(100vh - 64px)' }}>
        {children}
      </div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <PinProvider>
        <BoardProvider>
          <ConnectionProvider>
            <InvitationProvider>
              <Router>
                <div className="app-container">
                  <Routes>
                    {/* ... existing routes ... */}
                    <Route
                      path="/login"
                      element={
                        <AppLayout>
                          <LoginPage />
                        </AppLayout>
                      }
                    />
                    <Route
                      path="/register"
                      element={
                        <AppLayout>
                          <RegisterPage />
                        </AppLayout>
                      }
                    />
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <AppLayout>
                            <HomePage />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/boards"
                      element={
                        <ProtectedRoute>
                          <AppLayout>
                            <BoardsPage />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/connections"
                      element={
                        <ProtectedRoute>
                          <AppLayout>
                            <ConnectionsPage />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile/:userId"
                      element={
                        <ProtectedRoute>
                          <AppLayout>
                            <ProfilePage />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/followers/:userId"
                      element={
                        <ProtectedRoute>
                          <AppLayout>
                            <FollowersPage />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/invitations"
                      element={
                        <ProtectedRoute>
                          <AppLayout>
                            <InvitationsPage />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/business-profiles"
                      element={
                        <ProtectedRoute>
                          <AppLayout>
                            <BusinessProfilesPage />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/board/:boardId"
                      element={
                        <ProtectedRoute>
                          <AppLayout>
                            <BoardPage />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/pin/:pinId"
                      element={
                        <ProtectedRoute>
                          <AppLayout>
                            <PinDetailPage />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/search"
                      element={
                        <ProtectedRoute>
                          <AppLayout>
                            <SearchPage />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/create-pin"
                      element={
                        <ProtectedRoute>
                          <AppLayout>
                            <CreatePinPage />
                          </AppLayout>
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </div>
              </Router>
            </InvitationProvider>
          </ConnectionProvider>
        </BoardProvider>
      </PinProvider>
    </AuthProvider>
  );
};

export default App;