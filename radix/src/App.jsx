import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { PropertySearchPage } from './pages/PropertySearchPage';
import { ContractGenerationPage } from './pages/ContractGenerationPage';
import { DocumentManagementPage } from './pages/DocumentManagementPage';
import { MessagingPage } from './pages/MessagingPage';
import { AttorneyWorkflowPage } from './pages/AttorneyWorkflowPage';
import AttorneyDashboardPage from './pages/AttorneyDashboardPage';
import AttorneyClientManagementPage from './pages/AttorneyClientManagementPage';
import AttorneyCalendarPage from './pages/AttorneyCalendarPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <PublicRoute>
                  <SignupPage />
                </PublicRoute>
              } 
            />

            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/properties" 
              element={
                <ProtectedRoute>
                  <PropertySearchPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/contracts" 
              element={
                <ProtectedRoute>
                  <ContractGenerationPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/documents" 
              element={
                <ProtectedRoute>
                  <DocumentManagementPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/messages" 
              element={
                <ProtectedRoute>
                  <MessagingPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/attorneys" 
              element={
                <ProtectedRoute>
                  <AttorneyWorkflowPage />
                </ProtectedRoute>
              } 
            />

            {/* Attorney Routes */}
            <Route 
              path="/attorney-dashboard" 
              element={
                <ProtectedRoute>
                  <AttorneyDashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/attorney-clients" 
              element={
                <ProtectedRoute>
                  <AttorneyClientManagementPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/attorney-calendar" 
              element={
                <ProtectedRoute>
                  <AttorneyCalendarPage />
                </ProtectedRoute>
              } 
            />

            {/* Redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

