import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Product', path: '/' },
    { name: 'Technology', path: '/models.html' },
    { name: 'Research', path: '/research.html' },
    { name: 'Experience', path: '/blog.html' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.includes(path)) return true;
    return false;
  };

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        isScrolled ? 'pt-4' : 'pt-8'
      } px-6`}>
        <nav className={`mx-auto flex items-center justify-between px-6 py-2 rounded-full border transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isScrolled 
            ? 'max-w-3xl bg-black/80 backdrop-blur-2xl border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]' 
            : 'max-w-5xl bg-black/20 backdrop-blur-md border-white/5'
        }`}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center">
              <div className="absolute -inset-3 bg-purple-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img 
                src="/media/logo.png" 
                alt="TrainIQ" 
                className="h-7 w-7 object-contain invert brightness-200 relative z-10 transition-transform duration-500 group-hover:rotate-12"
                style={{ mixBlendMode: 'screen' }}
              />
            </div>
            <span className="font-bold text-lg tracking-tighter text-white/90 group-hover:text-white transition-colors">TRAINIQ</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-[13px] font-medium transition-all duration-300 relative py-2 px-4 rounded-full ${
                  isActive(link.path) 
                    ? 'text-white bg-white/10' 
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link 
              to="/signup.html" 
              className={`hidden sm:block bg-white text-black px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-wider hover:bg-neutral-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]`}
            >
              Pre-Order Now
            </Link>
            
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all"
            >
              <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[90] bg-black/95 backdrop-blur-2xl md:hidden transition-all duration-500 ${
        mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="flex flex-col items-center justify-center h-full gap-8 p-10">
          {navLinks.map((link, i) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-4xl font-bold tracking-tighter transition-all duration-500 delay-[${i * 100}ms] ${
                mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              } ${isActive(link.path) ? 'text-purple-500' : 'text-white'}`}
            >
              {link.name}
            </Link>
          ))}
          <Link 
            to="/signup.html"
            className={`mt-8 bg-white text-black px-10 py-4 rounded-full font-bold text-lg transition-all duration-500 ${
              mobileMenuOpen ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            }`}
          >
            Pre-Order Now
          </Link>
        </div>
      </div>
    </>
  );
}
