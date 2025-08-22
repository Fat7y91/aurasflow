'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from '../../lib/i18n';
import { Post } from '../../types/project';

interface PostEditorProps {
  post?: Post;
  onSave: (post: Omit<Post, 'id'>) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export default function PostEditor({ post, onSave, onCancel, isOpen }: PostEditorProps) {
  const { t } = useTranslations();
  const [formData, setFormData] = useState({
    title: post?.title || '',
    caption: post?.caption || '',
    channel: post?.channel || 'instagram' as const,
    status: post?.status || 'draft' as const,
    scheduledAt: post?.scheduledAt || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white/10 backdrop-blur-glass rounded-2xl p-6 border border-white/20 w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {post ? t('projectDashboard.posts.editPost') : t('projectDashboard.posts.newPost')}
          </h2>
          <button
            onClick={onCancel}
            className="text-white/70 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Post Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#7B5CE6] transition-colors"
              placeholder="Enter post title..."
              required
            />
          </div>

          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Caption
            </label>
            <textarea
              value={formData.caption}
              onChange={(e) => handleChange('caption', e.target.value)}
              rows={4}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#7B5CE6] transition-colors resize-none"
              placeholder="Write your caption..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Channel
              </label>
              <select
                value={formData.channel}
                onChange={(e) => handleChange('channel', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#7B5CE6] transition-colors"
              >
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="facebook">Facebook</option>
              </select>
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#7B5CE6] transition-colors"
              >
                <option value="draft">Draft</option>
                <option value="planned">Planned</option>
                <option value="scheduled">Scheduled</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          {(formData.status === 'scheduled' || formData.status === 'planned') && (
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Scheduled Date & Time
              </label>
              <input
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) => handleChange('scheduledAt', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#7B5CE6] transition-colors"
              />
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 px-6 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-6 bg-gradient-to-r from-[#7B5CE6] to-[#F28AC0] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              {post ? 'Update Post' : 'Create Post'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
