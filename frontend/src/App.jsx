import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import CustomerPage from './pages/CustomerPage';
import TransaksiPage from './pages/TransaksiPage';
import './App.css';

function App() {
  // ✅ Inisialisasi state dari localStorage (jika ada)
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // ✅ Sync state dengan localStorage setiap kali currentUser berubah
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Login Page - Public Route */}
        <Route 
          path="/" 
          element={
            currentUser ? (
              <Navigate to="/customer" replace />
            ) : (
              <LoginPage setCurrentUser={setCurrentUser} />
            )
          } 
        />

        {/* Customer Dashboard - Protected Route */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute>
              <CustomerPage 
                currentUser={currentUser} 
                setCurrentUser={setCurrentUser} 
              />
            </ProtectedRoute>
          }
        />

        {/* Transaksi/Beli Paket Page - Protected Route */}
        <Route
          path="/transaksi"
          element={
            <ProtectedRoute>
              <TransaksiPage 
                currentUser={currentUser} 
                setCurrentUser={setCurrentUser} 
              />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;