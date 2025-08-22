'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useTranslations } from '../lib/i18n';
import { getAccessToken, clearAuth, onAuthChange, isAuthenticated } from '../lib/auth';

interface NavbarProps {
  onMobileMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export default function Navbar({ onMobileMenuToggle, isMobileMenuOpen }: NavbarProps) {
  const { t, locale, changeLocale, dir, fontClass, isRTL } = useTranslations();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpenLocal, setIsMobileMenuOpenLocal] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  // Check if we're on the home page
  const isHomePage = pathname === '/';

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load auth status
  useEffect(() => {
    // Check authentication status initially
    const authStatus = isAuthenticated();
    console.log('Navbar: Initial auth status =', authStatus);
    setIsAuthed(authStatus);
    
    // Listen for auth state changes
    const cleanup = onAuthChange(() => {
      const newAuthStatus = isAuthenticated();
      console.log('Navbar: Auth changed =', newAuthStatus);
      setIsAuthed(newAuthStatus);
    });
    
    return cleanup;
  }, []); // Run once on mount

  // Toggle language and direction
  const toggleLanguage = () => {
    const newLang = locale === 'ar' ? 'en' : 'ar';
    changeLocale(newLang);
  };

  // Handle mobile menu toggle
  const handleMobileMenuToggle = () => {
    const newState = !isMobileMenuOpenLocal;
    setIsMobileMenuOpenLocal(newState);
    onMobileMenuToggle?.();
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      // Call logout API
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      // Show success message
      toast.success(locale === 'ar' ? 'تم تسجيل الخروج بنجاح' : 'Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(locale === 'ar' ? 'خطأ في تسجيل الخروج' : 'Logout error');
    } finally {
      // Clear local state and redirect
      clearAuth();
      router.push('/login');
    }
  };

  // Navigation links
  const navLinks = [
    { href: '/', label: t('nav.home'), key: 'home' },
    { href: '/services', label: t('nav.services'), key: 'services' },
    { href: '/pricing', label: t('nav.pricing'), key: 'pricing' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isHomePage 
            ? (isScrolled
                ? 'bg-white/20 backdrop-blur-glass-strong border-b border-border-glass/40'
                : 'bg-white/15 backdrop-blur-glass-strong border-b border-border-glass/30')
            : 'bg-white shadow-lg border-b border-gray-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
              href="/" 
              className={`flex items-center gap-3 text-xl font-bold hover:scale-105 transition-all duration-200 ${
                isHomePage && !isScrolled 
                  ? 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] [text-shadow:_0_2px_8px_rgba(0,0,0,0.8)]' 
                  : 'text-purple-600'
              }`}
            >
              <div className="w-10 h-10 bg-gradient-button rounded-xl flex items-center justify-center shadow-button">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-bold text-lg">{t('nav.logo')}</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  className={`font-medium px-4 py-2 rounded-glass transition-all duration-200 hover:transform hover:-translate-y-0.5 ${
                    isHomePage && !isScrolled
                      ? `text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] [text-shadow:_0_2px_8px_rgba(0,0,0,0.8)] hover:bg-white/20 ${pathname === link.href ? 'bg-white/20' : ''}`
                      : `text-gray-800 hover:text-purple-600 hover:bg-purple-50 ${pathname === link.href ? 'text-purple-600 bg-purple-50' : ''}`
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Authenticated user links */}
              {isAuthed ? (
                  <>
                    <Link
                      href="/dashboard"
                      className={`font-medium px-4 py-2 rounded-glass transition-all duration-200 hover:transform hover:-translate-y-0.5 ${
                        isHomePage && !isScrolled
                          ? `text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] [text-shadow:_0_2px_8px_rgba(0,0,0,0.8)] hover:bg-white/20 ${pathname?.toString() === '/dashboard' ? 'bg-white/20' : ''}`
                          : `text-gray-800 hover:text-purple-600 hover:bg-purple-50 ${pathname === '/dashboard' ? 'text-purple-600 bg-purple-50' : ''}`
                      }`}
                    >
                      {t('nav.dashboard')}
                    </Link>
                    <Link
                      href="/projects"
                      className={`font-medium px-4 py-2 rounded-glass transition-all duration-200 hover:transform hover:-translate-y-0.5 ${
                        isHomePage && !isScrolled
                          ? `text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] [text-shadow:_0_2px_8px_rgba(0,0,0,0.8)] hover:bg-white/20 ${pathname?.toString() === '/projects' ? 'bg-white/20' : ''}`
                          : `text-gray-800 hover:text-purple-600 hover:bg-purple-50 ${pathname === '/projects' ? 'text-purple-600 bg-purple-50' : ''}`
                      }`}
                    >
                      {t('nav.projects')}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={`font-medium px-4 py-2 rounded-glass transition-all duration-200 hover:transform hover:-translate-y-0.5 ${
                        isHomePage && !isScrolled
                          ? 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] [text-shadow:_0_2px_8px_rgba(0,0,0,0.8)] hover:bg-red-500/20'
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                    >
                      {t('nav.logout')}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className={`font-medium px-4 py-2 rounded-glass transition-all duration-200 hover:transform hover:-translate-y-0.5 ${
                        isHomePage && !isScrolled
                          ? 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] [text-shadow:_0_2px_8px_rgba(0,0,0,0.8)] hover:bg-white/20'
                          : 'text-gray-800 hover:text-purple-600 hover:bg-purple-50'
                      }`}
                    >
                      {t('nav.login')}
                    </Link>
                    <Link
                      href="/register"
                      className="bg-gradient-button text-white font-medium px-6 py-2 rounded-glass shadow-button transition-all duration-200 hover:shadow-button-hover hover:transform hover:-translate-y-0.5"
                    >
                      {t('nav.register')}
                    </Link>
                  </>
                )}

              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className={`font-medium px-3 py-2 rounded-glass border transition-all duration-200 hover:transform hover:-translate-y-0.5 ${
                  isHomePage && !isScrolled
                    ? 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] [text-shadow:_0_2px_8px_rgba(0,0,0,0.8)] border-white/30 hover:bg-white/20'
                    : 'text-gray-800 border-gray-300 hover:bg-gray-100'
                }`}
              >
                {locale === 'ar' ? 'EN' : 'ع'}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={handleMobileMenuToggle}
              className={`md:hidden p-2 rounded-glass transition-all duration-200 ${
                isHomePage && !isScrolled
                  ? 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] [text-shadow:_0_2px_8px_rgba(0,0,0,0.8)] hover:bg-white/20'
                  : 'text-gray-800 hover:bg-gray-100'
              }`}
              aria-label={t('nav.menu')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {(isMobileMenuOpen || isMobileMenuOpenLocal) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={isHomePage 
                ? "md:hidden bg-white/15 backdrop-blur-glass-strong border-t border-border-glass/30"
                : "md:hidden bg-white shadow-lg border-t border-gray-200"
              }
            >
              <div className="px-4 py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.key}
                    href={link.href}
                    className={`block font-medium px-4 py-3 rounded-glass transition-all duration-200 ${
                      isHomePage && !isScrolled
                        ? `text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] [text-shadow:_0_2px_8px_rgba(0,0,0,0.8)] hover:bg-white/20 ${pathname === link.href ? 'bg-white/20' : ''}`
                        : `text-gray-800 hover:bg-gray-100 ${pathname === link.href ? 'bg-gray-100' : ''}`
                    }`}
                    onClick={() => setIsMobileMenuOpenLocal(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                
                {/* Mobile Auth Links */}
                {isAuthed ? (
                  <>
                    <Link
                      href="/dashboard"
                      className={`block font-medium px-4 py-3 rounded-glass transition-all duration-200 ${
                        isHomePage && !isScrolled
                          ? `text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] [text-shadow:_0_2px_8px_rgba(0,0,0,0.8)] hover:bg-white/20 ${pathname?.toString() === '/dashboard' ? 'bg-white/20' : ''}`
                          : `text-gray-800 hover:bg-gray-100 ${pathname === '/dashboard' ? 'bg-gray-100' : ''}`
                      }`}
                      onClick={() => setIsMobileMenuOpenLocal(false)}
                    >
                      {t('nav.dashboard')}
                    </Link>
                    <Link
                      href="/projects"
                      className={`block font-medium px-4 py-3 rounded-glass transition-all duration-200 ${
                        isHomePage && !isScrolled
                          ? `text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] [text-shadow:_0_2px_8px_rgba(0,0,0,0.8)] hover:bg-white/20 ${pathname?.toString() === '/projects' ? 'bg-white/20' : ''}`
                          : `text-gray-800 hover:bg-gray-100 ${pathname === '/projects' ? 'bg-gray-100' : ''}`
                      }`}
                      onClick={() => setIsMobileMenuOpenLocal(false)}
                    >
                      {t('nav.projects')}
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpenLocal(false);
                      }}
                      className={`block w-full text-left font-medium px-4 py-3 rounded-glass transition-all duration-200 ${
                        isHomePage && !isScrolled
                          ? 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] [text-shadow:_0_2px_8px_rgba(0,0,0,0.8)] hover:bg-red-500/20'
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                    >
                      {t('nav.logout')}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className={`block font-medium px-4 py-3 rounded-glass transition-all duration-200 ${
                        isHomePage && !isScrolled
                          ? 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] [text-shadow:_0_2px_8px_rgba(0,0,0,0.8)] hover:bg-white/20'
                          : 'text-gray-800 hover:bg-gray-100'
                      }`}
                      onClick={() => setIsMobileMenuOpenLocal(false)}
                    >
                      {t('nav.login')}
                    </Link>
                    <Link
                      href="/register"
                      className="block bg-gradient-button text-white font-medium px-4 py-3 rounded-glass shadow-button transition-all duration-200 hover:shadow-button-hover"
                      onClick={() => setIsMobileMenuOpenLocal(false)}
                    >
                      {t('nav.register')}
                    </Link>
                  </>
                )}
                
                {/* Mobile Language Toggle */}
                <button
                  onClick={toggleLanguage}
                  className={`block w-full text-left font-medium px-4 py-3 rounded-glass border transition-all duration-200 ${
                    isHomePage && !isScrolled
                      ? 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] [text-shadow:_0_2px_8px_rgba(0,0,0,0.8)] border-white/30 hover:bg-white/20'
                      : 'text-gray-800 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {locale === 'ar' ? 'English' : 'العربية'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}