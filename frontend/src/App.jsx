import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastContainer } from './components/Toast'
import ProtectedRoute from './components/ProtectedRoute'

import Login         from './pages/Login'
import Dashboard     from './pages/Dashboard'
import NewEntry      from './pages/NewEntry'
import Travelers     from './pages/Travelers'
import TravelerDetail from './pages/TravelerDetail'
import Cases         from './pages/Cases'
import CaseDetail    from './pages/CaseDetail'
import Admin         from './pages/Admin'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/"      element={<Navigate to="/dashboard" replace />} />

          {/* All authenticated roles */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/travelers" element={
            <ProtectedRoute><Travelers /></ProtectedRoute>
          } />
          <Route path="/travelers/:id" element={
            <ProtectedRoute><TravelerDetail /></ProtectedRoute>
          } />
          <Route path="/cases" element={
            <ProtectedRoute><Cases /></ProtectedRoute>
          } />
          <Route path="/cases/:id" element={
            <ProtectedRoute><CaseDetail /></ProtectedRoute>
          } />

          {/* Officers + Admin only */}
          <Route path="/entry/new" element={
            <ProtectedRoute roles={['admin', 'border_officer']}><NewEntry /></ProtectedRoute>
          } />

          {/* Admin only */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}><Admin /></ProtectedRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}