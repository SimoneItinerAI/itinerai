import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { Button } from './ui/Button';
import { useSelector, useDispatch } from 'react-redux'
import { clearAuth } from '../store/slices/authSlice'
import { pushToast } from '../store/slices/uiSlice'
import { RootState } from '../store'

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useSelector((s: RootState) => s.auth.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const navigationItems = [
    { name: 'Come funziona', href: '#how-it-works' },
    { name: 'Perché ItinerAI', href: '#why-itinerai' },
    { name: 'Esempio', href: '#example' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="ItinerAI logo" className="w-8 h-8" />
            <span className="text-xl font-bold text-primary">ItinerAI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-neutral-600 hover:text-primary transition-colors duration-200 font-medium"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Accedi
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" size="sm">Registrati</Button>
                </Link>
              </>
            ) : (
              <>
                <span className="text-neutral-700">{user.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { dispatch(clearAuth()); dispatch(pushToast({ id: Date.now().toString(), message: 'Logout effettuato', type: 'info' })); navigate('/'); }}
                >
                  Esci
                </Button>
                <Link to="/dashboard">
                  <Button variant="secondary" size="sm">Dashboard</Button>
                </Link>
              </>
            )}
            <Link to="/create">
              <Button variant="primary" size="sm">
                Crea Itinerario
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-neutral-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-primary" />
            ) : (
              <Menu className="w-6 h-6 text-primary" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-200">
            <nav className="flex flex-col space-y-4">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-neutral-600 hover:text-primary transition-colors duration-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-neutral-200">
                {!user ? (
                  <>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="justify-start w-full">
                        <User className="w-4 h-4 mr-2" />
                        Accedi
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="justify-start w-full">Registrati</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start w-full"
                      onClick={() => { setIsMenuOpen(false); dispatch(clearAuth()); dispatch(pushToast({ id: Date.now().toString(), message: 'Logout effettuato', type: 'info' })); navigate('/'); }}
                    >
                      Esci
                    </Button>
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="secondary" size="sm" className="justify-start w-full">Dashboard</Button>
                    </Link>
                  </>
                )}
                <Link to="/create" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="justify-start w-full">
                    Crea Itinerario
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
