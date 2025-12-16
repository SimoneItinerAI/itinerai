import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect, useState } from 'react'
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import ProtectedRoute from './routes/ProtectedRoute'
import { Toast } from './components/ui/Toast'
import { Spinner } from './components/ui/Spinner'
import { WelcomeOverlay } from './components/WelcomeOverlay'

const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })))
const CreateItineraryPage = lazy(() => import('./pages/CreateItineraryPage').then(m => ({ default: m.CreateItineraryPage })))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const BookingPage = lazy(() => import('./pages/BookingPage'))

function AppContent() {
  const location = useLocation()
  const [showWelcome, setShowWelcome] = useState(false)
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const force = params.get('welcome') === '1'
    if (force) localStorage.removeItem('welcomeSeen')
    const seen = localStorage.getItem('welcomeSeen')
    if ((force && location.pathname === '/') || (!seen && location.pathname === '/')) setShowWelcome(true)
  }, [location.pathname, location.search])
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
  }, [])
  return (
    <div className="min-h-screen bg-neutral-50">
      {showWelcome && (
        <WelcomeOverlay durationMs={4000} onDone={() => setShowWelcome(false)} />
      )}
      <Header />
      <main>
        <Suspense fallback={<div className="p-8 flex items-center gap-3"><Spinner /><span>Caricamento…</span></div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreateItineraryPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/booking/:id" element={<BookingPage />} />
            </Route>
          </Routes>
        </Suspense>
      </main>
      {(['\/login','\/register'].includes(location.pathname)) ? null : <Footer />}
      <Toast />
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
