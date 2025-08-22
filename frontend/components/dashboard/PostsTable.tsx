'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from '../../lib/i18n';
import { Post } from '../../types/project';

interface PostsTableProps {
  posts: Post[];
  onEditPost: (post: Post) => void;
  onDeletePost: (postId: string) => void;
  onNewPost: () => void;
}

export default function PostsTable({ posts, onEditPost, onDeletePost, onNewPost }: PostsTableProps) {
  const { t } = useTranslations();
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);

  const handleSelectAll = () => {
    if (selectedPosts.length === posts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(posts.map(post => post.id));
    }
  };

  const handleSelectPost = (postId: string) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-400 bg-green-400/20';
      case 'scheduled': return 'text-blue-400 bg-blue-400/20';
      case 'draft': return 'text-yellow-400 bg-yellow-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white/10 backdrop-blur-glass rounded-2xl p-6 border border-white/20"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">
          {t('projectDashboard.posts.title')}
        </h3>
        <div className="flex gap-2">
          {selectedPosts.length > 0 && (
            <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
              Delete ({selectedPosts.length})
            </button>
          )}
          <button 
            onClick={onNewPost}
            className="px-4 py-2 bg-[#7B5CE6]/20 text-[#7B5CE6] rounded-lg hover:bg-[#7B5CE6]/30 transition-colors"
          >
            + New Post
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-3">
                <input
                  type="checkbox"
                  checked={selectedPosts.length === posts.length && posts.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-white/20 bg-white/10"
                />
              </th>
              <th className="text-left p-3 text-white/70 font-medium">Content</th>
              <th className="text-left p-3 text-white/70 font-medium">Channel</th>
              <th className="text-left p-3 text-white/70 font-medium">Status</th>
              <th className="text-left p-3 text-white/70 font-medium">Scheduled</th>
              <th className="text-left p-3 text-white/70 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, index) => (
              <motion.tr
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedPosts.includes(post.id)}
                    onChange={() => handleSelectPost(post.id)}
                    className="rounded border-white/20 bg-white/10"
                  />
                </td>
                <td className="p-3">
                  <div className="max-w-xs">
                    <p className="text-white text-sm font-medium truncate">
                      {post.title}
                    </p>
                    <p className="text-white/50 text-xs truncate">
                      {post.caption}
                    </p>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex gap-1">
                    <span
                      className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full"
                    >
                      {post.channel}
                    </span>
                  </div>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                    {post.status}
                  </span>
                </td>
                <td className="p-3">
                  <span className="text-white/70 text-sm">
                    {post.scheduledAt ? formatDate(new Date(post.scheduledAt)) : '-'}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEditPost(post)}
                      className="text-[#7B5CE6] hover:text-[#7B5CE6]/80 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeletePost(post.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-white/50 text-lg mb-2">No posts yet</div>
            <div className="text-white/30 text-sm">Create your first post to get started</div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
