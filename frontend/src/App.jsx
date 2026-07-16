import { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';
import LoadingScreen from './components/LoadingScreen/LoadingScreen.jsx';
import ScrollProgressBar from './components/ScrollProgressBar/ScrollProgressBar.jsx';
import BackToTop from './components/BackToTop/BackToTop.jsx';
import CustomCursor from './components/CustomCursor/CustomCursor.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Signup = lazy(() => import('./pages/Signup.jsx'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword.jsx'));
const ResetPassword = lazy(() => import('./pages/ResetPassword.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));

export default function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  // Determine if we should show the public layout components
  const isAppRoute = ['/login', '/signup', '/forgot-password', '/reset-password', '/dashboard'].some(path => location.pathname.startsWith(path));

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <AnimatePresence>{loading && <LoadingScreen key="loading" />}</AnimatePresence>

      {!loading && (
        <>
          {!isAppRoute && <CustomCursor />}
          {!isAppRoute && <ScrollProgressBar />}
          {!isAppRoute && <Navbar />}
          
          <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                
                {/* Dashboard Route (Protected) */}
                <Route 
                  path="/dashboard/*" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </Suspense>
          
          {!isAppRoute && <Footer />}
          {!isAppRoute && <BackToTop />}
        </>
      )}
    </>
  );
}
