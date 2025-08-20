'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getAccessToken, isAuthenticated } from '../../lib/auth';
import { apiGet } from '../../src/lib/api';

interface User {
  id: string;
  name?: string;
  email: string;
}

interface Project {
  id: string;
  name: string;
  brandJson?: {
    primaryColor?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Translations
const translations = {
  ar: {
    dashboard: 'لوحة التحكم',
    welcome: 'مرحباً',
    accountInfo: 'معلومات الحساب',
    email: 'البريد الإلكتروني',
    currentPlan: 'الخطة الحالية',
    free: 'مجانية',
    upgradePlan: 'ترقية الخطة',
    recentProjects: 'المشاريع الأخيرة',
    viewAllProjects: 'عرض جميع المشاريع',
    noProjects: 'لا توجد مشاريع',
    noProjectsDesc: 'ابدأ بإنشاء مشروعك الأول',
    createProject: 'إنشاء مشروع جديد',
    loading: 'جاري التحميل...',
    error: 'حدث خطأ في تحميل البيانات',
    features: 'المميزات',
    planFeatures: {
      projects: '٥ مشاريع',
      tools: 'أدوات أساسية',
      support: 'دعم المجتمع'
    }
  },
  en: {
    dashboard: 'Dashboard',
    welcome: 'Welcome',
    accountInfo: 'Account Information',
    email: 'Email',
    currentPlan: 'Current Plan',
    free: 'Free',
    upgradePlan: 'Upgrade Plan',
    recentProjects: 'Recent Projects',
    viewAllProjects: 'View All Projects',
    noProjects: 'No Projects',
    noProjectsDesc: 'Start by creating your first project',
    createProject: 'Create New Project',
    loading: 'Loading...',
    error: 'Error loading data',
    features: 'Features',
    planFeatures: {
      projects: '5 projects',
      tools: 'Basic tools',
      support: 'Community support'
    }
  }
};

export default function DashboardPage() {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [user, setUser] = useState<User | null>(null);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [authChecked, setAuthChecked] = useState(false); // Prevent re-checking
  const router = useRouter();

  const t = translations[language];

  // Check auth first
  useEffect(() => {
    // Only check auth once
    if (authChecked) return;
    
    console.log('Dashboard: Checking authentication');
    
    // Get tokens from both sources
    const localToken = getAccessToken();
    const authStatus = isAuthenticated();
    
    console.log('Dashboard: Local token =', localToken ? 'EXISTS' : 'MISSING');
    console.log('Dashboard: Auth status =', authStatus);
    
    setAuthChecked(true); // Mark as checked
    
    if (!authStatus || !localToken) {
      console.log('Dashboard: Not authenticated, redirecting to login...');
      // Clear any invalid tokens
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      }
      router.replace('/login');
      return;
    }
    
    console.log('Dashboard: User is authenticated, proceeding...');
    setIsCheckingAuth(false);
  }, [authChecked, router]); // Add authChecked dependency

  // Load language preference
  useEffect(() => {
    const savedLang = localStorage.getItem('language') as 'ar' | 'en' || 'ar';
    setLanguage(savedLang);
  }, []);

  // Load dashboard data only if authenticated
  useEffect(() => {
    // Don't load data if still checking auth, auth not checked yet, or not authenticated
    if (isCheckingAuth || !authChecked || !isAuthenticated()) {
      return;
    }

    const loadDashboardData = async () => {
      const token = getAccessToken();
      console.log('Dashboard: Loading with token');
      
      if (!token) {
        console.log('Dashboard: No token, redirecting');
        router.replace('/login?from=/dashboard');
        return;
      }

      try {
        console.log('Dashboard: Starting data load');
        setLoading(true);
        setError(null);

        // Load user info first
        console.log('Dashboard: Loading user data');
        const userData = await apiGet<User>('/me');
        console.log('Dashboard - User data loaded:', userData);
        setUser(userData);

        // Load recent projects (don't fail if this fails)
        try {
          console.log('Dashboard - Loading projects');
          const projectsData = await apiGet<any>('/projects?page=1&limit=5');
          const projectsList = Array.isArray(projectsData) 
            ? projectsData 
            : (projectsData.projects || projectsData.data || []);
          console.log('Dashboard - Projects loaded:', projectsList);
          setRecentProjects(projectsList.slice(0, 5));
        } catch (projectsError) {
          console.warn('Failed to load projects:', projectsError);
          setRecentProjects([]);
        }

      } catch (err: any) {
        console.error('Dashboard load error:', err);
        
        // If it's a network/timeout error, show fallback data
        if (err.name === 'AbortError' || err.message?.includes('fetch')) {
          console.log('Dashboard - Network error, showing fallback');
          // Set fallback user data
          setUser({ 
            id: 'temp', 
            email: localStorage.getItem('user_email') || 'user@example.com' 
          });
          setRecentProjects([]);
          setError('تعذر الاتصال بالخادم، يتم عرض البيانات المحفوظة محلياً');
        } else if (err.message?.includes('401') || err.message?.includes('unauthorized')) {
          // Token is invalid, redirect to login
          console.log('Dashboard - Unauthorized, redirecting to login');
          router.replace('/login?from=/dashboard');
          return;
        } else {
          setError(err.message || 'Failed to load dashboard data');
        }
      } finally {
        console.log('Dashboard - Loading complete');
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [isCheckingAuth, authChecked]); // Update dependencies

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', options);
  };

  // Auth checking state
  if (isCheckingAuth || !authChecked) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mb-4 mx-auto"></div>
          <p className="text-white text-xl mb-2">جاري التحقق من المصادقة...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show nothing (will redirect)
  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl">جاري إعادة التوجيه...</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mb-4 mx-auto"></div>
          <p className="text-white text-xl mb-2">{t.loading}</p>
          <p className="text-white/60 text-sm">جاري تحميل بيانات لوحة التحكم...</p>
          {user && <p className="text-white/60 text-sm mt-2">مرحباً {user.email}</p>}
        </div>
      </div>
    );
  }

  // Retry function for failed loads
  const retryLoadData = () => {
    setError(null);
    setAuthChecked(false); // This will trigger data reload
  };

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">{t.error}</p>
          <p className="text-white/70 text-sm mb-4">{error}</p>
          <button
            onClick={retryLoadData}
            className="bg-gradient-button text-white px-6 py-3 rounded-glass hover:shadow-button transition-all duration-200"
          >
            {language === 'ar' ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            {t.welcome}, {user?.name || user?.email || '—'}!
          </h1>
          <p className="text-white/80 text-lg">{t.dashboard}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/10 backdrop-blur-glass rounded-card p-6 border border-border-glass">
              <h2 className="text-white text-xl font-semibold mb-4">{t.accountInfo}</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-white/70 text-sm block mb-1">{t.email}</label>
                  <p className="text-white font-medium">{user?.email || '—'}</p>
                </div>
                
                <div>
                  <label className="text-white/70 text-sm block mb-1">{t.currentPlan}</label>
                  <div className="bg-white/5 rounded-glass p-4 border border-border-glass">
                    <h3 className="text-white font-semibold text-lg mb-2">
                      {t.free}
                    </h3>
                    <p className="text-white/70 text-sm mb-3">{t.features}:</p>
                    <ul className="space-y-1">
                      <li className="text-white/80 text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                        {t.planFeatures.projects}
                      </li>
                      <li className="text-white/80 text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                        {t.planFeatures.tools}
                      </li>
                      <li className="text-white/80 text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                        {t.planFeatures.support}
                      </li>
                    </ul>
                    <button className="w-full mt-4 bg-gradient-button text-white py-2 px-4 rounded-glass hover:shadow-button transition-all duration-200">
                      {t.upgradePlan}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/10 backdrop-blur-glass rounded-card p-6 border border-border-glass">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white text-xl font-semibold">{t.recentProjects}</h2>
                <Link
                  href="/projects"
                  className="text-accent hover:text-accent/80 transition-colors duration-200 font-medium"
                >
                  {t.viewAllProjects}
                </Link>
              </div>

              {recentProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white/5 rounded-glass p-4 border border-border-glass hover:border-accent/30 transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-glass flex items-center justify-center"
                            style={{ 
                              backgroundColor: project.brandJson?.primaryColor || '#6366f1',
                              background: `linear-gradient(135deg, ${project.brandJson?.primaryColor || '#6366f1'}, ${project.brandJson?.primaryColor || '#8b5cf6'})`
                            }}
                          >
                            <span className="text-white font-bold text-lg">
                              {project.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-white font-medium group-hover:text-accent transition-colors duration-200">
                              {project.name}
                            </h3>
                            <p className="text-white/60 text-sm">
                              {formatDate(project.updatedAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-sm">
                          {formatDate(project.createdAt)}
                        </span>
                        <Link
                          href={`/projects/${project.id}`}
                          className="text-accent hover:text-accent/80 transition-colors duration-200 text-sm font-medium"
                        >
                          {language === 'ar' ? 'عرض' : 'View'}
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <p className="text-white/80 text-lg font-medium mb-2">{t.noProjects}</p>
                  <p className="text-white/60 mb-4">{t.noProjectsDesc}</p>
                  <Link
                    href="/projects"
                    className="inline-flex items-center bg-gradient-button text-white px-6 py-3 rounded-glass hover:shadow-button hover:transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    {t.createProject}
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}