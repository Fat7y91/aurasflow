'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { apiGet } from '../../src/lib/api';

type Project = {
  id: string;
  name: string;
  ownerId: string;
  brandJson?: { primaryColor?: string } | null;
  createdAt: string;
  updatedAt: string;
};

type PaginatedResponse = {
  items: Project[];
  page: number;
  limit: number;
  total: number;
  pageCount: number;
};

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [total, setTotal] = useState(0);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  const [name, setName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#667eea');
  const [creating, setCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Delete confirmation state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Archived'>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'nameAsc' | 'nameDesc' | 'updated'>('newest');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Load saved language preference
  useEffect(() => {
    const savedLang = localStorage.getItem('language') as 'ar' | 'en' || 'ar';
    setLanguage(savedLang);
  }, []);

  // Translations
  const translations = {
    ar: {
      projects: 'المشاريع',
      myProjects: 'مشاريعي',
      noProjects: 'لا توجد مشاريع',
      noProjectsDesc: 'ابدأ بإنشاء مشروعك الأول',
      createProject: 'إنشاء مشروع جديد',
      projectName: 'اسم المشروع',
      primaryColor: 'اللون الأساسي',
      create: 'إنشاء',
      creating: 'جاري الإنشاء...',
      cancel: 'إلغاء',
      search: 'البحث في المشاريع',
      searchPlaceholder: 'ابحث بالاسم...',
      filter: 'التصفية',
      sortBy: 'ترتيب حسب',
      all: 'الكل',
      active: 'نشط',
      archived: 'مؤرشف',
      newest: 'الأحدث',
      oldest: 'الأقدم',
      nameAsc: 'الاسم (أ-ي)',
      nameDesc: 'الاسم (ي-أ)',
      updated: 'آخر تحديث',
      refresh: 'تحديث',
      loadMore: 'تحميل المزيد',
      loading: 'جاري التحميل...',
      error: 'حدث خطأ',
      retry: 'إعادة المحاولة',
      projectsFound: 'مشروع',
      created: 'تم الإنشاء',
      lastUpdated: 'آخر تحديث',
      viewProject: 'عرض المشروع',
      editProject: 'تعديل المشروع',
      deleteProject: 'حذف المشروع',
      confirmDelete: 'تأكيد الحذف',
      deleteWarning: 'هل أنت متأكد من حذف المشروع؟',
      deleteDescription: 'لا يمكن التراجع عن هذا الإجراء',
      projectWillBeDeleted: 'سيتم حذف المشروع نهائياً',
      typeProjectName: 'اكتب اسم المشروع للتأكيد',
      delete: 'حذف',
      deleting: 'جاري الحذف...',
      deleteSuccess: 'تم حذف المشروع بنجاح',
      deleteError: 'فشل في حذف المشروع'
    },
    en: {
      projects: 'Projects',
      myProjects: 'My Projects',
      noProjects: 'No Projects',
      noProjectsDesc: 'Start by creating your first project',
      createProject: 'Create New Project',
      projectName: 'Project Name',
      primaryColor: 'Primary Color',
      create: 'Create',
      creating: 'Creating...',
      cancel: 'Cancel',
      search: 'Search Projects',
      searchPlaceholder: 'Search by name...',
      filter: 'Filter',
      sortBy: 'Sort By',
      all: 'All',
      active: 'Active',
      archived: 'Archived',
      newest: 'Newest',
      oldest: 'Oldest',
      nameAsc: 'Name (A-Z)',
      nameDesc: 'Name (Z-A)',
      updated: 'Last Updated',
      refresh: 'Refresh',
      loadMore: 'Load More',
      loading: 'Loading...',
      error: 'An error occurred',
      retry: 'Retry',
      projectsFound: 'projects',
      created: 'Created',
      lastUpdated: 'Last Updated',
      viewProject: 'View Project',
      editProject: 'Edit Project',
      deleteProject: 'Delete Project',
      confirmDelete: 'Confirm Delete',
      deleteWarning: 'Are you sure you want to delete this project?',
      deleteDescription: 'This action cannot be undone',
      projectWillBeDeleted: 'The project will be permanently deleted',
      typeProjectName: 'Type the project name to confirm',
      delete: 'Delete',
      deleting: 'Deleting...',
      deleteSuccess: 'Project deleted successfully',
      deleteError: 'Failed to delete project'
    }
  };

  const t = translations[language];

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load projects on component mount and when sort changes
  useEffect(() => {
    loadPage(1);
  }, [sortBy]);

  // Filter and search projects
  const filteredProjects = useMemo(() => {
    let filtered = projects;

    // Apply text search
    if (debouncedQuery.trim()) {
      const query = debouncedQuery.toLowerCase();
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (filterStatus !== 'All') {
      if (filterStatus === 'Archived') {
        filtered = []; // No archived projects for now
      }
    }

    return filtered;
  }, [projects, debouncedQuery, filterStatus]);

  async function loadPage(page: number, append = false, isRefresh = false) {
    const isFirstLoad = page === 1 && !append;
    if (isFirstLoad) {
      setLoading(true);
    } else if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoadingMore(true);
    }
    setErr(null);
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        sort: sortBy
      });
      
      const data: PaginatedResponse = await apiGet(`/projects?${params.toString()}`);
      
      if (append) {
        setProjects(prev => [...prev, ...data.items]);
      } else {
        setProjects(data.items);
      }
      
      setCurrentPage(data.page);
      setPageCount(data.pageCount);
      setTotal(data.total);
    } catch (e: any) {
      if (e?.message?.includes('401') || e?.message?.includes('Unauthorized')) {
        router.replace('/login?from=/projects');
        return;
      }
      setErr(e?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }

  async function refresh() {
    await loadPage(1, false, true);
  }

  async function retry() {
    setErr(null);
    await loadPage(1, false);
  }

  async function handleSortChange(newSort: typeof sortBy) {
    setSortBy(newSort);
    setRefreshing(true);
    try {
      const params = new URLSearchParams({
        page: '1',
        limit: '10',
        sort: newSort
      });
      
      const data: PaginatedResponse = await apiGet(`/projects?${params.toString()}`);
      setProjects(data.items);
      setCurrentPage(data.page);
      setPageCount(data.pageCount);
      setTotal(data.total);
    } catch (e: any) {
      if (e?.message?.includes('401') || e?.message?.includes('Unauthorized')) {
        router.replace('/login?from=/projects');
        return;
      }
      setErr(e?.message || 'Failed to load projects');
    } finally {
      setRefreshing(false);
    }
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (creating || !name.trim()) return;
    
    setCreating(true);
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
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

      toast.success(
        language === 'ar' ? 'تم إنشاء المشروع بنجاح' : 'Project created successfully',
        {
          style: {
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            color: '#10b981',
            fontWeight: '600'
          }
        }
      );

      // Reset form and reload projects
      setName('');
      setPrimaryColor('#667eea');
      setShowCreateModal(false);
      await refresh();
    } catch (e: any) {
      toast.error(e?.message || 'Failed to create project', {
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
      setCreating(false);
    }
  }

  // Handle delete project
  const handleDeleteProject = (project: Project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete || deleting) return;
    
    setDeleting(true);
    try {
      const response = await fetch(`/api/projects/${projectToDelete.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP ${response.status}`);
      }

      toast.success(t.deleteSuccess, {
        style: {
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '12px',
          color: '#10b981',
          fontWeight: '600'
        }
      });

      // Remove project from local state
      setProjects(prev => prev.filter(p => p.id !== projectToDelete.id));
      setTotal(prev => prev - 1);
      
      // Close modal
      setShowDeleteModal(false);
      setProjectToDelete(null);
    } catch (e: any) {
      toast.error(e?.message || t.deleteError, {
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
      setDeleting(false);
    }
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      language === 'ar' ? 'ar-EG' : 'en-US',
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }
    );
  };

  // Loading skeleton component
  const ProjectSkeleton = () => (
    <div className="bg-white/15 backdrop-blur-glass-strong border border-border-glass rounded-card p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="h-6 bg-white/20 rounded w-32"></div>
        <div className="w-6 h-6 bg-white/20 rounded"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-white/20 rounded w-24"></div>
        <div className="h-4 bg-white/20 rounded w-20"></div>
      </div>
      <div className="mt-4 pt-4 border-t border-white/10 flex justify-between">
        <div className="h-8 bg-white/20 rounded w-20"></div>
        <div className="h-8 bg-white/20 rounded w-16"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-hero pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{t.myProjects}</h1>
            <p className="text-white/80">
              {total} {t.projectsFound}
            </p>
          </div>
          
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <button
              onClick={refresh}
              disabled={refreshing || loading}
              className="flex items-center gap-2 bg-white/10 border border-border-glass text-white px-4 py-2 rounded-glass font-medium hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <svg 
                className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {t.refresh}
            </button>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-button text-white font-semibold px-6 py-2 rounded-glass hover:shadow-button hover:transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t.createProject}
            </button>
          </div>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/15 backdrop-blur-glass-strong border border-border-glass rounded-card p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-white font-medium mb-2">
                {t.search}
              </label>
              <div className="relative">
                <input
                  id="search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full px-4 py-3 bg-white/10 border border-border-glass rounded-glass text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
                />
                <svg className="absolute right-3 rtl:right-auto rtl:left-3 top-3.5 w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Filter */}
            <div>
              <label htmlFor="filter" className="block text-white font-medium mb-2">
                {t.filter}
              </label>
              <select
                id="filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'All' | 'Active' | 'Archived')}
                className="w-full px-4 py-3 bg-white/10 border border-border-glass rounded-glass text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
              >
                <option value="All">{t.all}</option>
                <option value="Active">{t.active}</option>
                <option value="Archived">{t.archived}</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label htmlFor="sort" className="block text-white font-medium mb-2">
                {t.sortBy}
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value as typeof sortBy)}
                className="w-full px-4 py-3 bg-white/10 border border-border-glass rounded-glass text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
              >
                <option value="newest">{t.newest}</option>
                <option value="oldest">{t.oldest}</option>
                <option value="nameAsc">{t.nameAsc}</option>
                <option value="nameDesc">{t.nameDesc}</option>
                <option value="updated">{t.updated}</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Error State */}
        {err && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/20 border border-red-500/30 rounded-card p-6 mb-8 text-center"
          >
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">{t.error}</h3>
            <p className="text-white/80 mb-4">{err}</p>
            <button
              onClick={retry}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-glass transition-colors duration-200"
            >
              {t.retry}
            </button>
          </motion.div>
        )}

        {/* Projects Grid */}
        {loading && projects.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProjectSkeleton key={i} />
            ))}
          </div>
        ) : filteredProjects.length === 0 && !loading ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">{t.noProjects}</h3>
            <p className="text-white/80 mb-6">{t.noProjectsDesc}</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-button text-white font-semibold px-8 py-3 rounded-glass hover:shadow-button hover:transform hover:-translate-y-0.5 transition-all duration-200"
            >
              {t.createProject}
            </button>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/15 backdrop-blur-glass-strong border border-border-glass rounded-card p-6 hover:bg-white/20 hover:transform hover:-translate-y-1 transition-all duration-300 group"
                >
                  {/* Project Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold"
                        style={{ 
                          background: project.brandJson?.primaryColor || '#667eea' 
                        }}
                      >
                        {project.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg mb-1">
                          {project.name}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="relative">
                        <button className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors duration-200">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-white/70 text-sm">
                      <svg className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z" />
                      </svg>
                      {t.created}: {formatDate(project.createdAt)}
                    </div>
                    <div className="flex items-center text-white/70 text-sm">
                      <svg className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      {t.lastUpdated}: {formatDate(project.updatedAt)}
                    </div>
                  </div>

                  {/* Project Actions */}
                  <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                    <Link
                      href={`/projects/${project.id}`}
                      className="bg-gradient-button text-white font-semibold px-4 py-2 rounded-glass hover:shadow-button hover:transform hover:-translate-y-0.5 transition-all duration-200 text-sm"
                    >
                      {t.viewProject}
                    </Link>
                    
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/projects/${project.id}/edit`}
                        className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors duration-200"
                        title={t.editProject}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      <button 
                        onClick={() => handleDeleteProject(project)}
                        className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors duration-200"
                        title={t.deleteProject}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Load More Button */}
            {currentPage < pageCount && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mt-8"
              >
                <button
                  onClick={() => loadPage(currentPage + 1, true)}
                  disabled={loadingMore}
                  className="bg-white/10 border border-border-glass text-white font-semibold px-8 py-3 rounded-glass hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 mx-auto"
                >
                  {loadingMore ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t.loading}
                    </>
                  ) : (
                    t.loadMore
                  )}
                </button>
              </motion.div>
            )}
          </>
        )}

        {/* Create Project Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                onClick={() => setShowCreateModal(false)}
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div className="bg-white/95 backdrop-blur-glass-strong border border-border-glass rounded-card p-8 w-full max-w-md">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.createProject}</h2>
                  
                  <form onSubmit={create} className="space-y-6">
                    {/* Project Name */}
                    <div>
                      <label htmlFor="projectName" className="block text-gray-700 font-medium mb-2">
                        {t.projectName}
                      </label>
                      <input
                        id="projectName"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t.projectName}
                        className="w-full px-4 py-3 border border-gray-300 rounded-glass text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>

                    {/* Primary Color */}
                    <div>
                      <label htmlFor="primaryColor" className="block text-gray-700 font-medium mb-2">
                        {t.primaryColor}
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          id="primaryColor"
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-12 h-12 border border-gray-300 rounded-glass cursor-pointer"
                        />
                        <input
                          type="text"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-glass text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowCreateModal(false)}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-glass hover:bg-gray-50 transition-colors duration-200"
                      >
                        {t.cancel}
                      </button>
                      <button
                        type="submit"
                        disabled={creating || !name.trim()}
                        className="bg-gradient-button text-white font-semibold px-6 py-3 rounded-glass hover:shadow-button disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                      >
                        {creating ? (
                          <>
                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t.creating}
                          </>
                        ) : (
                          t.create
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && projectToDelete && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                onClick={() => setShowDeleteModal(false)}
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div className="bg-white/95 backdrop-blur-glass-strong border border-border-glass rounded-card p-8 w-full max-w-md">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">{t.confirmDelete}</h2>
                    <p className="text-gray-600 text-sm">{t.deleteWarning}</p>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-glass p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
                        style={{ 
                          background: projectToDelete.brandJson?.primaryColor || '#667eea' 
                        }}
                      >
                        {projectToDelete.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 mb-1">
                          {projectToDelete.name}
                        </h3>
                        <p className="text-red-600 text-sm font-medium">
                          {t.projectWillBeDeleted}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowDeleteModal(false)}
                      disabled={deleting}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-glass hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {t.cancel}
                    </button>
                    <button
                      onClick={confirmDeleteProject}
                      disabled={deleting}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-glass disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                    >
                      {deleting ? (
                        <>
                          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {t.deleting}
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          {t.delete}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
