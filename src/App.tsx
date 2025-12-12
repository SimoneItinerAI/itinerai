import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react'
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import ProtectedRoute from './routes/ProtectedRoute'
import { Toast } from './components/ui/Toast'
import { Spinner } from './components/ui/Spinner'

const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })))
const CreateItineraryPage = lazy(() => import('./pages/CreateItineraryPage').then(m => ({ default: m.CreateItineraryPage })))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const BookingPage = lazy(() => import('./pages/BookingPage'))

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-neutral-50">
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
        <Footer />
        <Toast />
      </div>
    </Router>
  );
}

export default App;
