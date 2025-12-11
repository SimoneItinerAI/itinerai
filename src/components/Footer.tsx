import React from 'react';
import { Mail, Phone, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="ItinerAI logo" className="w-8 h-8" />
              <span className="text-xl font-bold">ItinerAI</span>
            </div>
            <p className="text-neutral-300 leading-relaxed">
              La tua intelligenza artificiale per viaggi personalizzati. Crea itinerari perfetti in pochi minuti.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-300 hover:text-accent transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-neutral-300 hover:text-accent transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-neutral-300 hover:text-accent transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-neutral-300 hover:text-accent transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Link Utili</h3>
            <ul className="space-y-2">
              <li>
                <a href="#how-it-works" className="text-neutral-300 hover:text-accent transition-colors">
                  Come funziona
                </a>
              </li>
              <li>
                <a href="#why-itinerai" className="text-neutral-300 hover:text-accent transition-colors">
                  Perché ItinerAI
                </a>
              </li>
              <li>
                <a href="#example" className="text-neutral-300 hover:text-accent transition-colors">
                  Esempio itinerario
                </a>
              </li>
              <li>
                <a href="#faq" className="text-neutral-300 hover:text-accent transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Servizi</h3>
            <ul className="space-y-2">
              <li>
                <a href="/create" className="text-neutral-300 hover:text-accent transition-colors">
                  Crea Itinerario
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-300 hover:text-accent transition-colors">
                  I miei viaggi
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-300 hover:text-accent transition-colors">
                  Supporto
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-300 hover:text-accent transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contatti</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-accent" />
                <span className="text-neutral-300">info@itinerai.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-accent" />
                <span className="text-neutral-300">+39 02 1234 5678</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-neutral-400">Iscriviti alla nostra newsletter</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="La tua email"
                  className="flex-1 px-3 py-2 bg-primary-light border border-neutral-600 rounded-l-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <button className="px-4 py-2 bg-accent hover:bg-accent-dark rounded-r-lg transition-colors">
                  Iscriviti
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-light mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-neutral-400 text-sm">
              © 2024 ItinerAI. Tutti i diritti riservati.
            </p>
            <div className="flex space-x-6 text-sm text-neutral-400">
              <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-accent transition-colors">Termini di Servizio</a>
              <a href="#" className="hover:text-accent transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
