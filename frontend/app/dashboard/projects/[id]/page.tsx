'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from '../../../../lib/i18n';
import { ProjectDetails, Post } from '../../../../types/project';
import { getSampleProject } from '../../../../lib/data/projects';

// Dashboard Components
import OverviewCard from '../../../../components/dashboard/OverviewCard';
import KPIStats from '../../../../components/dashboard/KPIStats';
import PlanCard from '../../../../components/dashboard/PlanCard';
import ProgressBar from '../../../../components/dashboard/ProgressBar';
import PostsTable from '../../../../components/dashboard/PostsTable';
import PostEditor from '../../../../components/dashboard/PostEditor';
import ActivityLog from '../../../../components/dashboard/ActivityLog';

interface Props {
  params: {
    id: string;
  };
}

export default function ProjectDashboard({ params }: Props) {
  const { t } = useTranslations();
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPostEditor, setShowPostEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | undefined>();

  useEffect(() => {
    // Simulate API call
    const loadProject = async () => {
      try {
        const projectData = getSampleProject(params.id);
        setProject(projectData);
      } catch (error) {
        console.error('Error loading project:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [params.id]);

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setShowPostEditor(true);
  };

  const handleDeletePost = (postId: string) => {
    if (!project) return;
    
    const updatedPosts = project.posts.filter(post => post.id !== postId);
    setProject({
      ...project,
      posts: updatedPosts
    });
  };

  const handleSavePost = (postData: Omit<Post, 'id'>) => {
    if (!project) return;

    if (editingPost) {
      // Update existing post
      const updatedPosts = project.posts.map(post =>
        post.id === editingPost.id ? { ...postData, id: editingPost.id } : post
      );
      setProject({
        ...project,
        posts: updatedPosts
      });
    } else {
      // Create new post
      const newPost: Post = {
        ...postData,
        id: `post_${Date.now()}`
      };
      setProject({
        ...project,
        posts: [...project.posts, newPost]
      });
    }

    setShowPostEditor(false);
    setEditingPost(undefined);
  };

  const handleCancelEdit = () => {
    setShowPostEditor(false);
    setEditingPost(undefined);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-[#7B5CE6] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-white mb-2">Project Not Found</h1>
          <p className="text-white/70">The project you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent mb-2"
          >
            {project.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/70"
          >
            {t('projectDashboard.subtitle')}
          </motion.p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Column - Overview & Plan */}
          <div className="xl:col-span-4 space-y-6">
            <OverviewCard project={project} />
            <PlanCard plan={project.plan} />
            <ProgressBar percentage={project.metrics.completionPct} />
          </div>

          {/* Middle Column - KPIs & Posts */}
          <div className="xl:col-span-5 space-y-6">
            <KPIStats metrics={project.metrics} />
            <PostsTable
              posts={project.posts}
              onEditPost={handleEditPost}
              onDeletePost={handleDeletePost}
              onNewPost={() => setShowPostEditor(true)}
            />
          </div>

          {/* Right Column - Activity Log */}
          <div className="xl:col-span-3">
            <ActivityLog activities={project.activityLog} />
          </div>
        </div>

        {/* Floating Action Button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowPostEditor(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-[#7B5CE6] to-[#F28AC0] rounded-full flex items-center justify-center text-white text-2xl shadow-lg shadow-[#7B5CE6]/25 hover:shadow-xl hover:shadow-[#7B5CE6]/40 transition-all"
        >
          +
        </motion.button>

        {/* Post Editor Modal */}
        <PostEditor
          post={editingPost}
          onSave={handleSavePost}
          onCancel={handleCancelEdit}
          isOpen={showPostEditor}
        />
      </motion.div>
    </div>
  );
}
