import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ResetPassword } from './pages/ResetPassword';
import { RegisterTutor } from './pages/RegisterTutor';
import { MyProfile } from './pages/MyProfile';
import { UserProfile } from './pages/UserProfile';
import { Notifications } from './pages/Notifications';
import { MarketplaceFeed } from './pages/MarketplaceFeed';
import { CreateListing } from './pages/CreateListing';
import { Home } from './pages/Home';
import { Inbox } from './pages/Inbox';
import { Favorites } from './pages/Favorites';
import { MyBookRequests } from './pages/MyBookRequests';
import { CreateBookRequest } from './pages/CreateBookRequest';
import { useAuthStore } from './store/useAuthStore';
import { ReportBug } from './pages/ReportBug';
import { TutorsFeed } from './pages/TutorsFeed';
import { TutorProfile } from './pages/TutorProfile';
import { ListingDetails } from './pages/ListingDetails';
import { MyListings } from './pages/MyListings';
import { TutorDashboard } from './pages/TutorDashboard';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsAndConditions } from './pages/TermsAndConditions';

// Un componente per proteggere le route accessibili solo da loggati
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 pt-16">
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Marketplace Routes */}
            <Route path="/marketplace" element={<MarketplaceFeed />} />
            <Route path="/marketplace/:type/:id" element={<ListingDetails />} />
            <Route path="/marketplace/create" element={<ProtectedRoute><CreateListing /></ProtectedRoute>} />

            {/* Tutoring Routes */}
            <Route path="/tutors" element={<TutorsFeed />} />
            <Route path="/tutors/:id" element={<TutorProfile />} />

            {/* Protected Routes */}
            <Route path="/tutor-onboarding" element={<ProtectedRoute><RegisterTutor /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
            <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
            <Route path="/my-requests" element={<ProtectedRoute><MyBookRequests /></ProtectedRoute>} />
            <Route path="/create-request" element={<ProtectedRoute><CreateBookRequest /></ProtectedRoute>} />
            <Route path="/report-bug" element={<ProtectedRoute><ReportBug /></ProtectedRoute>} />
            <Route path="/my-listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
            <Route path="/tutor-dashboard" element={<ProtectedRoute><TutorDashboard /></ProtectedRoute>} />
            
            {/* Public User View */}
            <Route path="/users/:id" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />

            {/* Legal Routes */}
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsAndConditions />} />

            {/* Redirect base */}
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
