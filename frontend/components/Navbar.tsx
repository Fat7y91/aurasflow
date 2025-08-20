'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { getAccessToken, clearAuth, onAuthChange, isAuthenticated } from '../lib/auth';

// Language and navigation data
const translations = {
  ar: {
    logo: 'أوراس فلو',
    home: 'الرئيسية',
    services: 'الخدمات',
    pricing: 'التسعير',
    projects: 'المشاريع',
    login: 'دخول',
    register: 'تسجيل',
    dashboard: 'لوحة التحكم',
    logout: 'خروج',
    language: 'العربية',
    menu: 'القائمة',
  },
  en: {
    logo: 'AurasFlow',
    home: 'Home',
    services: 'Services',
    pricing: 'Pricing',
    projects: 'Projects',
    login: 'Login',
    register: 'Register',
    dashboard: 'Dashboard',
    logout: 'Logout',
    language: 'English',
    menu: 'Menu',
  },
};

interface NavbarProps {
  onMobileMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export default function Navbar({ onMobileMenuToggle, isMobileMenuOpen }: NavbarProps) {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpenLocal, setIsMobileMenuOpenLocal] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const t = translations[language];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load saved language and check auth status
  useEffect(() => {
    // Get language from localStorage or default to Arabic
    const savedLang = (localStorage.getItem('language') as 'ar' | 'en') || 'ar';
    setLanguage(savedLang);
    
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
    const newLang = language === 'ar' ? 'en' : 'ar';
    
    // Save the new language
    localStorage.setItem('language', newLang);
    
    // Reload the page to ensure clean language switch and avoid hydration issues
    window.location.reload();
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
      toast.success(language === 'ar' ? 'تم تسجيل الخروج بنجاح' : 'Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(language === 'ar' ? 'خطأ في تسجيل الخروج' : 'Logout error');
    } finally {
      // Clear local state and redirect
      clearAuth();
      router.push('/login');
    }
  };

  // Navigation links
  const navLinks = [
    { href: '/', label: t.home, key: 'home' },
    { href: '/services', label: t.services, key: 'services' },
    { href: '/pricing', label: t.pricing, key: 'pricing' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/15 backdrop-blur-glass-strong border-b border-border-glass/30'
            : 'bg-white/10 backdrop-blur-glass border-b border-border-glass/20'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center gap-3 text-white text-xl font-bold hover:scale-105 transition-transform duration-200"
            >
              <div className="w-10 h-10 bg-gradient-button rounded-xl flex items-center justify-center shadow-button">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-bold text-lg">{t.logo}</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  className={`text-white font-medium px-4 py-2 rounded-glass transition-all duration-200 hover:bg-white/20 hover:transform hover:-translate-y-0.5 ${
                    pathname === link.href ? 'bg-white/20' : ''
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
                      className={`text-white font-medium px-4 py-2 rounded-glass transition-all duration-200 hover:bg-white/20 hover:transform hover:-translate-y-0.5 ${
                        pathname === '/dashboard' ? 'bg-white/20' : ''
                      }`}
                    >
                      {t.dashboard}
                    </Link>
                    <Link
                      href="/projects"
                      className={`text-white font-medium px-4 py-2 rounded-glass transition-all duration-200 hover:bg-white/20 hover:transform hover:-translate-y-0.5 ${
                        pathname === '/projects' ? 'bg-white/20' : ''
                      }`}
                    >
                      {t.projects}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-white font-medium px-4 py-2 rounded-glass transition-all duration-200 hover:bg-red-500/20 hover:transform hover:-translate-y-0.5"
                    >
                      {t.logout}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-white font-medium px-4 py-2 rounded-glass transition-all duration-200 hover:bg-white/20 hover:transform hover:-translate-y-0.5"
                    >
                      {t.login}
                    </Link>
                    <Link
                      href="/register"
                      className="bg-gradient-button text-white font-medium px-6 py-2 rounded-glass shadow-button transition-all duration-200 hover:shadow-button-hover hover:transform hover:-translate-y-0.5"
                    >
                      {t.register}
                    </Link>
                  </>
                )}

              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="text-white font-medium px-3 py-2 rounded-glass border border-white/30 transition-all duration-200 hover:bg-white/20 hover:transform hover:-translate-y-0.5"
              >
                {language === 'ar' ? 'EN' : 'ع'}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={handleMobileMenuToggle}
              className="md:hidden text-white p-2 rounded-glass transition-all duration-200 hover:bg-white/20"
              aria-label={t.menu}
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
              className="md:hidden bg-white/10 backdrop-blur-glass border-t border-border-glass/20"
            >
              <div className="px-4 py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.key}
                    href={link.href}
                    className={`block text-white font-medium px-4 py-3 rounded-glass transition-all duration-200 hover:bg-white/20 ${
                      pathname === link.href ? 'bg-white/20' : ''
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
                      className={`block text-white font-medium px-4 py-3 rounded-glass transition-all duration-200 hover:bg-white/20 ${
                        pathname === '/dashboard' ? 'bg-white/20' : ''
                      }`}
                      onClick={() => setIsMobileMenuOpenLocal(false)}
                    >
                      {t.dashboard}
                    </Link>
                    <Link
                      href="/projects"
                      className={`block text-white font-medium px-4 py-3 rounded-glass transition-all duration-200 hover:bg-white/20 ${
                        pathname === '/projects' ? 'bg-white/20' : ''
                      }`}
                      onClick={() => setIsMobileMenuOpenLocal(false)}
                    >
                      {t.projects}
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpenLocal(false);
                      }}
                      className="block w-full text-left text-white font-medium px-4 py-3 rounded-glass transition-all duration-200 hover:bg-red-500/20"
                    >
                      {t.logout}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block text-white font-medium px-4 py-3 rounded-glass transition-all duration-200 hover:bg-white/20"
                      onClick={() => setIsMobileMenuOpenLocal(false)}
                    >
                      {t.login}
                    </Link>
                    <Link
                      href="/register"
                      className="block bg-gradient-button text-white font-medium px-4 py-3 rounded-glass shadow-button transition-all duration-200 hover:shadow-button-hover"
                      onClick={() => setIsMobileMenuOpenLocal(false)}
                    >
                      {t.register}
                    </Link>
                  </>
                )}
                
                {/* Mobile Language Toggle */}
                <button
                  onClick={toggleLanguage}
                  className="block w-full text-left text-white font-medium px-4 py-3 rounded-glass border border-white/30 transition-all duration-200 hover:bg-white/20"
                >
                  {t.language}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}