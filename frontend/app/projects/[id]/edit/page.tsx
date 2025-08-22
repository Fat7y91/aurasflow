'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  ownerId: string;
  brandJson?: { primaryColor?: string } | null;
  createdAt: string;
  updatedAt: string;
}

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  // Form states
  const [name, setName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#667eea');

  // Translations
  const translations = {
    ar: {
      editProject: 'تعديل المشروع',
      projectDetails: 'تفاصيل المشروع',
      projectName: 'اسم المشروع',
      primaryColor: 'اللون الأساسي',
      save: 'حفظ',
      saving: 'جاري الحفظ...',
      cancel: 'إلغاء',
      loading: 'جاري التحميل...',
      error: 'حدث خطأ',
      projectNotFound: 'المشروع غير موجود',
      saveSuccess: 'تم حفظ التغييرات بنجاح',
      saveError: 'فشل في حفظ التغييرات',
      backToProjects: 'العودة إلى المشاريع',
      projectInfo: 'معلومات المشروع',
      created: 'تم الإنشاء',
      lastUpdated: 'آخر تحديث',
      projectSettings: 'إعدادات المشروع',
      branding: 'العلامة التجارية',
      colorPreview: 'معاينة اللون'
    },
    en: {
      editProject: 'Edit Project',
      projectDetails: 'Project Details',
      projectName: 'Project Name',
      primaryColor: 'Primary Color',
      save: 'Save',
      saving: 'Saving...',
      cancel: 'Cancel',
      loading: 'Loading...',
      error: 'An error occurred',
      projectNotFound: 'Project not found',
      saveSuccess: 'Changes saved successfully',
      saveError: 'Failed to save changes',
      backToProjects: 'Back to Projects',
      projectInfo: 'Project Information',
      created: 'Created',
      lastUpdated: 'Last Updated',
      projectSettings: 'Project Settings',
      branding: 'Branding',
      colorPreview: 'Color Preview'
    }
  };

  const t = translations[language];

  // Load language preference
  useEffect(() => {
    const savedLang = localStorage.getItem('language') as 'ar' | 'en' || 'ar';
    setLanguage(savedLang);
  }, []);

  // Load project data
  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(`/api/projects/${projectId}`, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          if (response.status === 404) {
            toast.error(t.projectNotFound);
            router.push('/projects');
            return;
          }
          throw new Error('Failed to load project');
        }
        
        const projectData = await response.json();
        setProject(projectData);
        setName(projectData.name);
        setPrimaryColor(projectData.brandJson?.primaryColor || '#667eea');
        
      } catch (error) {
        console.error('Project load error:', error);
        toast.error(t.error, {
          style: {
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            color: '#ef4444',
            fontWeight: '600'
          }
        });
        router.push('/projects');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      loadProject();
    }
  }, [projectId, router, t.error, t.projectNotFound]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving || !name.trim()) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          brandJson: { primaryColor }
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP ${response.status}`);
      }

      const updatedProject = await response.json();
      setProject(updatedProject);

      toast.success(t.saveSuccess, {
        style: {
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '12px',
          color: '#10b981',
          fontWeight: '600'
        }
      });

      // Navigate back to projects list
      router.push('/projects');
    } catch (error: any) {
      toast.error(error?.message || t.saveError, {
        style: {
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '12px',
          color: '#ef4444',
          fontWeight: '600'
        }
      });
    } finally {
      setSaving(false);
    }
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      language === 'ar' ? 'ar-EG' : 'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="bg-white/15 backdrop-blur-glass-strong border border-border-glass rounded-card p-8 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4"></div>
              <p className="text-white font-medium">{t.loading}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-hero pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-200 mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t.backToProjects}
          </Link>
          
          <div className="flex items-center gap-4 mb-2">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold text-lg"
              style={{ background: primaryColor }}
            >
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{t.editProject}</h1>
              <p className="text-white/80">{project.name}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Settings */}
              <div className="bg-white/15 backdrop-blur-glass-strong border border-border-glass rounded-card p-6">
                <h2 className="text-xl font-bold text-white mb-6">{t.projectSettings}</h2>
                
                <div className="space-y-6">
                  {/* Project Name */}
                  <div>
                    <label htmlFor="projectName" className="block text-white font-medium mb-2">
                      {t.projectName}
                    </label>
                    <input
                      id="projectName"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t.projectName}
                      className="w-full px-4 py-3 bg-white/10 border border-border-glass rounded-glass text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Branding */}
              <div className="bg-white/15 backdrop-blur-glass-strong border border-border-glass rounded-card p-6">
                <h2 className="text-xl font-bold text-white mb-6">{t.branding}</h2>
                
                <div className="space-y-6">
                  {/* Primary Color */}
                  <div>
                    <label htmlFor="primaryColor" className="block text-white font-medium mb-2">
                      {t.primaryColor}
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        id="primaryColor"
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-16 h-12 border border-border-glass rounded-glass cursor-pointer"
                      />
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="flex-1 px-4 py-3 bg-white/10 border border-border-glass rounded-glass text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    
                    {/* Color Preview */}
                    <div className="mt-4">
                      <p className="text-white/80 text-sm mb-2">{t.colorPreview}</p>
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold"
                          style={{ background: primaryColor }}
                        >
                          {name.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div 
                          className="px-4 py-2 rounded-glass text-white font-medium"
                          style={{ background: primaryColor }}
                        >
                          Sample Button
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3">
                <Link
                  href="/projects"
                  className="px-6 py-3 bg-white/10 border border-border-glass text-white rounded-glass font-medium hover:bg-white/20 transition-all duration-200"
                >
                  {t.cancel}
                </Link>
                <button
                  type="submit"
                  disabled={saving || !name.trim()}
                  className="bg-gradient-button text-white font-semibold px-8 py-3 rounded-glass hover:shadow-button hover:transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t.saving}
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {t.save}
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Project Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/15 backdrop-blur-glass-strong border border-border-glass rounded-card p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6">{t.projectInfo}</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-white/70 text-sm mb-1">{t.created}</p>
                  <p className="text-white font-medium">{formatDate(project.createdAt)}</p>
                </div>
                
                <div>
                  <p className="text-white/70 text-sm mb-1">{t.lastUpdated}</p>
                  <p className="text-white font-medium">{formatDate(project.updatedAt)}</p>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <Link
                    href={`/projects/${project.id}`}
                    className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-medium transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    عرض المشروع
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
