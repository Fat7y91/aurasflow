'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTranslations } from '../../lib/i18n';
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

export default function DashboardPage() {
  const { t, locale, dir } = useTranslations();
  const [user, setUser] = useState<User | null>(null);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [authChecked, setAuthChecked] = useState(false); // Prevent re-checking
  const router = useRouter();

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
          const projectsData = await apiGet<any>('/projects?limit=5&sort=-updatedAt');
          const projectsList = Array.isArray(projectsData) 
            ? projectsData 
            : (projectsData.projects || projectsData.data || projectsData.items || []);
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
    return date.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', options);
  };

  // Auth checking state
  if (isCheckingAuth || !authChecked) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mb-4 mx-auto"></div>
          <p className="text-white text-xl mb-2">{t('dashboard.loading.checkingAuth')}</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show nothing (will redirect)
  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl">{t('dashboard.loading.redirecting')}</p>
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
          <p className="text-white text-xl mb-2">{t('dashboard.loading.title')}</p>
          <p className="text-white/60 text-sm">{t('dashboard.loading.subtitle')}</p>
          {user && <p className="text-white/60 text-sm mt-2">{t('dashboard.loading.welcome').replace('{{email}}', user.email)}</p>}
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
          <p className="text-white text-xl mb-4">{t('dashboard.error')}</p>
          <p className="text-white/70 text-sm mb-4">{error}</p>
          <button
            onClick={retryLoadData}
            className="bg-gradient-button text-white px-6 py-3 rounded-glass hover:shadow-button transition-all duration-200"
          >
            {locale === 'ar' ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            {t('dashboard.welcome')}, {user?.name || user?.email || '—'}!
          </h1>
          <p className="text-white/80 text-lg">{t('dashboard.dashboard')}</p>
          
          {/* New Features Banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 bg-gradient-to-r from-[#7B5CE6]/20 to-[#F28AC0]/20 backdrop-blur-glass rounded-xl p-4 border border-[#7B5CE6]/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">
                  🎉 {locale === 'ar' ? 'لوحة تحكم المشاريع الجديدة متاحة الآن!' : 'New Project Dashboard Available!'}
                </h3>
                <p className="text-white/70 text-sm">
                  {locale === 'ar' 
                    ? 'إدارة متقدمة للمشاريع مع تحليلات KPI ولوحة النشاط وإدارة المنشورات'
                    : 'Advanced project management with KPI analytics, activity logs, and post management'
                  }
                </p>
              </div>
              <Link
                href="/dashboard/projects/demo"
                className="bg-gradient-to-r from-[#7B5CE6] to-[#F28AC0] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium whitespace-nowrap"
              >
                {locale === 'ar' ? 'جرب الآن' : 'Try Now'}
              </Link>
            </div>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="lg:col-span-3 mb-4"
          >
            <div className="bg-white/10 backdrop-blur-glass rounded-card p-6 border border-border-glass">
              <h2 className="text-white text-xl font-semibold mb-4">{locale === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href="/dashboard/projects/demo"
                  className="bg-gradient-to-r from-[#7B5CE6] to-[#F28AC0] p-4 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 group"
                >
                  <div className="text-white text-2xl mb-2">📊</div>
                  <h3 className="text-white font-semibold mb-1">
                    {locale === 'ar' ? 'لوحة المشروع المتطورة' : 'Advanced Project Dashboard'}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {locale === 'ar' ? 'KPI، إدارة المنشورات، تتبع النشاط' : 'KPIs, Post Management, Activity Tracking'}
                  </p>
                </Link>
                
                <Link
                  href="/pricing"
                  className="bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-all duration-200 border border-white/10 group"
                >
                  <div className="text-white text-2xl mb-2">💎</div>
                  <h3 className="text-white font-semibold mb-1">
                    {locale === 'ar' ? 'خطط التسعير' : 'Pricing Plans'}
                  </h3>
                  <p className="text-white/70 text-sm">
                    {locale === 'ar' ? 'اختر الخطة المناسبة لك' : 'Choose your perfect plan'}
                  </p>
                </Link>
                
                <Link
                  href="/projects"
                  className="bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-all duration-200 border border-white/10 group"
                >
                  <div className="text-white text-2xl mb-2">🚀</div>
                  <h3 className="text-white font-semibold mb-1">
                    {locale === 'ar' ? 'إنشاء مشروع جديد' : 'Create New Project'}
                  </h3>
                  <p className="text-white/70 text-sm">
                    {locale === 'ar' ? 'ابدأ مشروعك التالي' : 'Start your next project'}
                  </p>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* User Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/10 backdrop-blur-glass rounded-card p-6 border border-border-glass">
              <h2 className="text-white text-xl font-semibold mb-4">{t('dashboard.accountInfo')}</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-white/70 text-sm block mb-1">{t('dashboard.email')}</label>
                  <p className="text-white font-medium">{user?.email || '—'}</p>
                </div>
                
                <div>
                  <label className="text-white/70 text-sm block mb-1">{t('dashboard.currentPlan')}</label>
                  <div className="bg-white/5 rounded-glass p-4 border border-border-glass">
                    <h3 className="text-white font-semibold text-lg mb-2">
                      {t('dashboard.free')}
                    </h3>
                    <p className="text-white/70 text-sm mb-3">{t('dashboard.features')}:</p>
                    <ul className="space-y-1">
                      <li className="text-white/80 text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                        {t('dashboard.planFeatures.projects')}
                      </li>
                      <li className="text-white/80 text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                        {t('dashboard.planFeatures.tools')}
                      </li>
                      <li className="text-white/80 text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                        {t('dashboard.planFeatures.support')}
                      </li>
                    </ul>
                    <button className="w-full mt-4 bg-gradient-button text-white py-2 px-4 rounded-glass hover:shadow-button transition-all duration-200">
                      {t('dashboard.upgradePlan')}
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
                <h2 className="text-white text-xl font-semibold">{t('dashboard.recentProjects')}</h2>
                <Link
                  href="/projects"
                  className="text-accent hover:text-accent/80 transition-colors duration-200 font-medium"
                >
                  {t('dashboard.viewAllProjects')}
                </Link>
              </div>

              {loading ? (
                // Loading skeleton for projects
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="bg-white/5 rounded-glass p-4 border border-border-glass animate-pulse">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-white/10 rounded-glass"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-white/10 rounded w-1/2"></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="h-3 bg-white/10 rounded w-1/3"></div>
                        <div className="h-3 bg-white/10 rounded w-12"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentProjects.length > 0 ? (
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
                        <div className="flex gap-2">
                          <Link
                            href={`/projects/${project.id}`}
                            className="text-accent hover:text-accent/80 transition-colors duration-200 text-sm font-medium"
                          >
                            {locale === 'ar' ? 'عرض' : 'View'}
                          </Link>
                          <Link
                            href={`/dashboard/projects/${project.id}`}
                            className="bg-gradient-to-r from-[#7B5CE6] to-[#F28AC0] text-white px-3 py-1 rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                          >
                            {locale === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
                          </Link>
                        </div>
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
                  <p className="text-white/80 text-lg font-medium mb-2">{t('dashboard.noProjects')}</p>
                  <p className="text-white/60 mb-4">{t('dashboard.noProjectsDesc')}</p>
                  <div className="flex gap-4 justify-center">
                    <Link
                      href="/projects"
                      className="inline-flex items-center bg-gradient-button text-white px-6 py-3 rounded-glass hover:shadow-button hover:transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      {t('dashboard.createProject')}
                    </Link>
                    <Link
                      href="/dashboard/projects/demo"
                      className="inline-flex items-center bg-gradient-to-r from-[#7B5CE6] to-[#F28AC0] text-white px-6 py-3 rounded-glass hover:shadow-button hover:transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      {locale === 'ar' ? 'مشاهدة لوحة تحكم تجريبية' : 'View Demo Dashboard'}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}